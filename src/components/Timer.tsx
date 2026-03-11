import type { TimerData } from "../types";
import { useTimer } from "../hooks/useTimer";

interface Props {
  data: TimerData;
  onUpdate: (data: TimerData) => void;
}

export function Timer({ data, onUpdate }: Props) {
  const { minutes, seconds, running, finished, start, stop, reset } = useTimer({
    initialMinutes: data.minutes,
    initialSeconds: data.seconds,
  });

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="timer-container">
      {!running && !finished && (
        <div className="timer-setting">
          <label>
            分
            <input
              type="number"
              className="number-input"
              min={0}
              max={99}
              value={data.minutes}
              onChange={(e) =>
                onUpdate({
                  ...data,
                  minutes: Math.max(0, parseInt(e.target.value) || 0),
                })
              }
            />
          </label>
          <label>
            秒
            <input
              type="number"
              className="number-input"
              min={0}
              max={59}
              value={data.seconds}
              onChange={(e) =>
                onUpdate({
                  ...data,
                  seconds: Math.min(
                    59,
                    Math.max(0, parseInt(e.target.value) || 0),
                  ),
                })
              }
            />
          </label>
        </div>
      )}
      <div className={`timer-display ${finished ? "finished" : ""}`}>
        {pad(minutes)}:{pad(seconds)}
      </div>
      <div className="timer-buttons">
        {!running ? (
          <button className="start-button" onClick={start}>
            スタート
          </button>
        ) : (
          <button className="stop-button" onClick={stop}>
            ストップ
          </button>
        )}
        <button className="reset-button" onClick={reset}>
          リセット
        </button>
      </div>
    </div>
  );
}
