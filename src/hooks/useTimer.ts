import { useCallback, useEffect, useRef, useState } from "react";

interface UseTimerOptions {
  initialMinutes: number;
  initialSeconds: number;
  onComplete?: () => void;
}

export function useTimer({
  initialMinutes,
  initialSeconds,
  onComplete,
}: UseTimerOptions) {
  const [totalSeconds, setTotalSeconds] = useState(
    initialMinutes * 60 + initialSeconds,
  );
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const initialTotal = initialMinutes * 60 + initialSeconds;

  useEffect(() => {
    setTotalSeconds(initialMinutes * 60 + initialSeconds);
    setFinished(false);
    setRunning(false);
  }, [initialMinutes, initialSeconds]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev <= 1) {
          setRunning(false);
          setFinished(true);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, onComplete]);

  const start = useCallback(() => {
    if (totalSeconds > 0) {
      setFinished(false);
      setRunning(true);
    }
  }, [totalSeconds]);

  const stop = useCallback(() => setRunning(false), []);

  const reset = useCallback(() => {
    setRunning(false);
    setFinished(false);
    setTotalSeconds(initialTotal);
  }, [initialTotal]);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { minutes, seconds, running, finished, start, stop, reset };
}
