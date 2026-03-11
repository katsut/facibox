import type { TimerData } from "../types";
import { useTimer } from "../hooks/useTimer";

interface Props {
  data: TimerData;
  onUpdate: (data: TimerData) => void;
}

const SIZE = 200;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function Timer({ data, onUpdate }: Props) {
  const { minutes, seconds, running, overtime, start, stop, reset } = useTimer({
    initialMinutes: data.minutes,
    initialSeconds: data.seconds,
  });

  const pad = (n: number) => String(n).padStart(2, "0");

  const initialTotal = data.minutes * 60 + data.seconds;
  const currentTotal = minutes * 60 + seconds;

  let progress: number;
  let isDanger: boolean;

  if (overtime) {
    progress = 1;
    isDanger = true;
  } else {
    progress = initialTotal > 0 ? currentTotal / initialTotal : 0;
    isDanger = running && currentTotal <= 10 && currentTotal > 0;
  }

  const dashOffset = CIRCUMFERENCE * (1 - progress);
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

      <div className={`timer-ring-wrapper ${overtime ? "timer-overtime" : ""}`}>
        <svg
          className="timer-ring"
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
        >
          <defs>
            <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDanger ? "#ef4444" : "#4f6df5"} />
              <stop
                offset="100%"
                stopColor={isDanger ? "#f97316" : "#818cf8"}
              />
            </linearGradient>
          </defs>
          <circle
            className="timer-ring-bg"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE}
          />
          <circle
            className="timer-ring-progress"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE}
            stroke="url(#timerGrad)"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div
          className={`timer-time ${overtime ? "overtime" : ""} ${isDanger && !overtime ? "danger-pulse" : ""}`}
        >
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
