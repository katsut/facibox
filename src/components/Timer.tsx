import type { TimerData } from "../types";
import { useTimer } from "../hooks/useTimer";

interface Props {
  data: TimerData;
  onUpdate: (data: TimerData) => void;
}

const RING_RADIUS = 78;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function Timer({ data, onUpdate }: Props) {
  const { minutes, seconds, running, overtime, start, stop, reset } = useTimer({
    initialMinutes: data.minutes,
    initialSeconds: data.seconds,
  });

  const pad = (n: number) => String(n).padStart(2, "0");

  const initialTotal = data.minutes * 60 + data.seconds;
  const currentTotal = minutes * 60 + seconds;

  let progress: number;
  let dashOffset: number;
  let isDanger: boolean;

  if (overtime) {
    progress = 1;
    dashOffset = 0;
    isDanger = true;
  } else {
    progress = initialTotal > 0 ? currentTotal / initialTotal : 0;
    dashOffset = RING_CIRCUMFERENCE * (1 - progress);
    isDanger = running && currentTotal <= 10 && currentTotal > 0;
  }

  const isIdle = !running && !overtime;

  return (
    <div className="timer-container">
      {isIdle && (
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
      <div className="timer-ring-wrapper">
        <svg
          className="timer-ring"
          width="180"
          height="180"
          viewBox="0 0 180 180"
        >
          <circle className="timer-ring-bg" cx="90" cy="90" r={RING_RADIUS} />
          <circle
            className={`timer-ring-progress ${isDanger ? "danger" : ""}`}
            cx="90"
            cy="90"
            r={RING_RADIUS}
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className={`timer-time ${overtime ? "overtime" : ""}`}>
          {overtime && <span className="overtime-prefix">+</span>}
          {pad(minutes)}:{pad(seconds)}
        </div>
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
