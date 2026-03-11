import { useCallback, useEffect, useRef, useState } from "react";

interface UseTimerOptions {
  initialMinutes: number;
  initialSeconds: number;
}

export function useTimer({ initialMinutes, initialSeconds }: UseTimerOptions) {
  const initialTotal = initialMinutes * 60 + initialSeconds;
  const [totalSeconds, setTotalSeconds] = useState(initialTotal);
  const [running, setRunning] = useState(false);
  const [overtime, setOvertime] = useState(false);
  const [overtimeSeconds, setOvertimeSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setTotalSeconds(initialMinutes * 60 + initialSeconds);
    setOvertime(false);
    setOvertimeSeconds(0);
    setRunning(false);
  }, [initialMinutes, initialSeconds]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      if (overtime) {
        setOvertimeSeconds((prev) => prev + 1);
      } else {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            setOvertime(true);
            setOvertimeSeconds(0);
            playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, overtime]);

  const start = useCallback(() => {
    if (!overtime && totalSeconds <= 0) return;
    setRunning(true);
  }, [totalSeconds, overtime]);

  const stop = useCallback(() => setRunning(false), []);

  const reset = useCallback(() => {
    setRunning(false);
    setOvertime(false);
    setOvertimeSeconds(0);
    setTotalSeconds(initialTotal);
  }, [initialTotal]);

  const displaySeconds = overtime ? overtimeSeconds : totalSeconds;
  const minutes = Math.floor(displaySeconds / 60);
  const seconds = displaySeconds % 60;

  return { minutes, seconds, running, overtime, start, stop, reset };
}

function playAlarm() {
  const ctx = new AudioContext();

  const playBeep = (startTime: number, freq: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  const now = ctx.currentTime;
  playBeep(now, 880, 0.15);
  playBeep(now + 0.2, 880, 0.15);
  playBeep(now + 0.4, 880, 0.15);
  playBeep(now + 0.7, 1760, 0.4);
}
