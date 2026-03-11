import { useState, useRef, useCallback, useMemo } from "react";
import type { RouletteData } from "../types";
import { useI18n } from "../i18n";

interface Props {
  data: RouletteData;
  onUpdate: (data: RouletteData) => void;
}

const PASTEL_COLORS = [
  "#93b5ff",
  "#ffc09f",
  "#a0e7a0",
  "#ffb3b3",
  "#c4b5fd",
  "#f9cb8b",
  "#99e6e6",
  "#f4a4c0",
  "#b5d6a7",
  "#d4c4fb",
];

const WHEEL_SIZE = 260;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = CENTER - 4;

function polarToCart(angleDeg: number, r: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CENTER + r * Math.cos(rad), y: CENTER + r * Math.sin(rad) };
}

function segmentPath(startAngle: number, endAngle: number) {
  const s = polarToCart(startAngle, RADIUS);
  const e = polarToCart(endAngle, RADIUS);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M${CENTER},${CENTER} L${s.x},${s.y} A${RADIUS},${RADIUS} 0 ${large} 1 ${e.x},${e.y} Z`;
}

export function Roulette({ data, onUpdate }: Props) {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [resultIdx, setResultIdx] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [autoRemove, setAutoRemove] = useState(false);
  const [removingIdx, setRemovingIdx] = useState<number | null>(null);
  const [editing, setEditing] = useState(true);
  const wheelRef = useRef<SVGGElement>(null);

  const [decided, setDecided] = useState(false);

  const addItem = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onUpdate({ items: [...data.items, trimmed] });
    setInput("");
  };

  const removeItem = useCallback(
    (index: number) => {
      setRemovingIdx(index);
      setTimeout(() => {
        onUpdate({ items: data.items.filter((_, i) => i !== index) });
        setRemovingIdx(null);
        if (resultIdx === index) {
          setResult(null);
          setResultIdx(null);
        } else if (resultIdx !== null && index < resultIdx) {
          setResultIdx(resultIdx - 1);
        }
      }, 250);
    },
    [data.items, onUpdate, resultIdx],
  );

  const spin = () => {
    if (data.items.length === 0 || spinning) return;
    setSpinning(true);
    setResult(null);
    setResultIdx(null);
    setDecided(false);
    setShowConfetti(false);

    const items = data.items;
    const winIdx = Math.floor(Math.random() * items.length);
    const seg = 360 / items.length;
    const offset = Math.random() * seg;
    const targetAngle = 360 - winIdx * seg - offset;
    const spins = 5 + Math.floor(Math.random() * 4);
    const finalRotation =
      rotation + spins * 360 + targetAngle - (rotation % 360);

    setRotation(finalRotation);

    setTimeout(() => {
      setResult(items[winIdx]);
      setResultIdx(winIdx);
      setSpinning(false);
      setDecided(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }, 4200);
  };

  const next = () => {
    if (autoRemove && resultIdx !== null) {
      onUpdate({ items: data.items.filter((_, i) => i !== resultIdx) });
    }
    setResult(null);
    setResultIdx(null);
    setDecided(false);
  };

  const count = data.items.length;
  const segAngle = count > 0 ? 360 / count : 360;

  const segments = useMemo(() => {
    if (count === 0) return [];
    return data.items.map((item, i) => {
      const start = i * segAngle;
      const end = start + segAngle;
      const mid = start + segAngle / 2;
      const color = PASTEL_COLORS[i % PASTEL_COLORS.length];
      const labelPos = polarToCart(mid, RADIUS * 0.72);
      return {
        item,
        start,
        end,
        mid,
        color,
        labelPos,
        path: segmentPath(start, end),
      };
    });
  }, [data.items, count, segAngle]);

  const showEditor = editing || count === 0;

  return (
    <div className="list-container">
      {count > 0 && (
        <button className="mode-toggle" onClick={() => setEditing(!editing)}>
          {showEditor ? t("common.start") : t("common.edit")}
        </button>
      )}

      {showEditor ? (
        <>
          <div className="input-row">
            <input
              type="text"
              className="text-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.nativeEvent.isComposing && addItem()
              }
              placeholder={t("roulette.inputPlaceholder")}
            />
            <button className="secondary-button" onClick={addItem}>
              {t("common.add")}
            </button>
          </div>

          {count > 0 && (
            <button
              className="reset-all-button"
              onClick={() => {
                if (confirm(t("roulette.deleteAllConfirm"))) {
                  onUpdate({ items: [] });
                  setResult(null);
                  setResultIdx(null);
                }
              }}
            >
              {t("roulette.deleteAll")}
            </button>
          )}

          {count > 0 && (
            <div className="wheel-items-compact">
              {data.items.map((item, i) => (
                <label
                  key={i}
                  className={`wheel-item-tag ${removingIdx === i ? "removing" : ""}`}
                >
                  <span
                    className="wheel-item-dot"
                    style={{
                      background: PASTEL_COLORS[i % PASTEL_COLORS.length],
                    }}
                  />
                  <span>{item}</span>
                  <button
                    className="remove-button"
                    onClick={() => removeItem(i)}
                  >
                    ✕
                  </button>
                </label>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="wheel-wrapper">
            <div className="wheel-pointer" />
            <svg
              width={WHEEL_SIZE}
              height={WHEEL_SIZE}
              viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
              className="wheel-svg"
            >
              <g
                ref={wheelRef}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: "50% 50%",
                  transition: spinning
                    ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                    : "none",
                }}
              >
                {count === 1 ? (
                  <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    fill={PASTEL_COLORS[0]}
                  />
                ) : (
                  segments.map((seg, i) => (
                    <path key={i} d={seg.path} fill={seg.color} />
                  ))
                )}
                {segments.map((seg, i) => (
                  <text
                    key={`l${i}`}
                    x={seg.labelPos.x}
                    y={seg.labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={count <= 8 ? 12 : 9}
                    fontWeight="600"
                    fill="#333"
                    transform={`rotate(${seg.mid}, ${seg.labelPos.x}, ${seg.labelPos.y})`}
                  >
                    {seg.item.length > 6
                      ? seg.item.slice(0, 6) + "…"
                      : seg.item}
                  </text>
                ))}
                {count > 1 &&
                  segments.map((seg, i) => {
                    const p = polarToCart(seg.start, RADIUS);
                    return (
                      <line
                        key={`d${i}`}
                        x1={CENTER}
                        y1={CENTER}
                        x2={p.x}
                        y2={p.y}
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="1.5"
                      />
                    );
                  })}
              </g>
              <circle
                cx={CENTER}
                cy={CENTER}
                r="14"
                fill="#fff"
                stroke="#e4e4e7"
                strokeWidth="2"
              />
            </svg>

            {showConfetti && <div className="confetti-burst" />}

            {result !== null && !spinning && (
              <div className="wheel-result-overlay">
                <span className="wheel-result-text">{result}</span>
              </div>
            )}
          </div>

          <label className="roulette-option">
            <input
              type="checkbox"
              checked={autoRemove}
              onChange={(e) => setAutoRemove(e.target.checked)}
            />
            {t("roulette.autoRemove")}
          </label>

          {decided ? (
            <button className="next-button" onClick={next}>
              {t("common.next")}
            </button>
          ) : (
            <button
              className="primary-button"
              onClick={spin}
              disabled={count === 0 || spinning}
              style={{ padding: "12px" }}
            >
              {spinning ? t("roulette.spinning") : t("roulette.spin")}
            </button>
          )}
        </>
      )}
    </div>
  );
}
