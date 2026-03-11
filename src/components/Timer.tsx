import type { TimerData } from "../types";
import type { TimerState } from "../hooks/useTimer";
import { useI18n } from "../i18n";

interface Props {
  data: TimerData;
  onUpdate: (data: TimerData) => void;
  collapsed: boolean;
  timer: TimerState;
}

const SIZE = 200;
const MINI_SIZE = 80;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function Timer({ data, onUpdate, collapsed, timer }: Props) {
  const { t } = useI18n();
  const { minutes, seconds, running, overtime, start, stop, reset } = timer;

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

  const miniStroke = 4;
  const miniRadius = (MINI_SIZE - miniStroke) / 2;
  const miniCirc = 2 * Math.PI * miniRadius;
  const miniDashOffset = miniCirc * (1 - progress);

  if (collapsed) {
    return (
      <div className="timer-mini">
        <svg
          className="timer-ring"
          width={MINI_SIZE}
          height={MINI_SIZE}
          viewBox={`0 0 ${MINI_SIZE} ${MINI_SIZE}`}
        >
          <defs>
            <linearGradient
              id="timerGradMini"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={isDanger ? "#ef4444" : "#4f6df5"} />
              <stop
                offset="100%"
                stopColor={isDanger ? "#f97316" : "#818cf8"}
              />
            </linearGradient>
          </defs>
          <circle
            className="timer-ring-bg"
            cx={MINI_SIZE / 2}
            cy={MINI_SIZE / 2}
            r={miniRadius}
            strokeWidth={miniStroke}
          />
          <circle
            className="timer-ring-progress"
            cx={MINI_SIZE / 2}
            cy={MINI_SIZE / 2}
            r={miniRadius}
            strokeWidth={miniStroke}
            stroke="url(#timerGradMini)"
            strokeDasharray={miniCirc}
            strokeDashoffset={miniDashOffset}
          />
        </svg>
        <div
          className={`timer-mini-time ${overtime ? "overtime" : ""} ${isDanger && !overtime ? "danger-pulse" : ""}`}
        >
          {overtime && <span className="overtime-prefix-mini">+</span>}
          {pad(minutes)}:{pad(seconds)}
        </div>
      </div>
    );
  }

  return (
    <div className="timer-container">
      {isIdle && (
        <div className="timer-setting">
          <label>
            {t("timer.minutes")}
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
            {t("timer.seconds")}
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

      <label className="roulette-option">
        <input
          type="checkbox"
          checked={timer.soundEnabled}
          onChange={(e) => timer.setSoundEnabled(e.target.checked)}
        />
        {t("timer.sound")}
      </label>

      <div className="timer-buttons">
        {!running ? (
          <button className="start-button" onClick={start}>
            {t("timer.start")}
          </button>
        ) : (
          <button className="stop-button" onClick={stop}>
            {t("timer.stop")}
          </button>
        )}
        <button className="reset-button" onClick={reset}>
          {t("common.reset")}
        </button>
      </div>
    </div>
  );
}
