import { useState, useRef, useCallback } from "react";
import type { RouletteData } from "../types";

interface Props {
  data: RouletteData;
  onUpdate: (data: RouletteData) => void;
}

const COLORS = [
  "#4f6df5",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
  "#6366f1",
  "#14b8a6",
];

export function Roulette({ data, onUpdate }: Props) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [resultIdx, setResultIdx] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const addItem = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onUpdate({ items: [...data.items, trimmed] });
    setInput("");
  };

  const removeItem = useCallback(
    (index: number) => {
      onUpdate({ items: data.items.filter((_, i) => i !== index) });
      if (resultIdx === index) {
        setResult(null);
        setResultIdx(null);
      }
    },
    [data.items, onUpdate, resultIdx],
  );

  const spin = () => {
    if (data.items.length === 0 || spinning) return;
    setSpinning(true);
    setResult(null);
    setResultIdx(null);

    const winIdx = Math.floor(Math.random() * data.items.length);
    const segAngle = 360 / data.items.length;
    const targetAngle = 360 - winIdx * segAngle - segAngle / 2;
    const spins = 5 + Math.random() * 3;
    const finalRotation =
      rotation + spins * 360 + targetAngle - (rotation % 360);

    setRotation(finalRotation);

    setTimeout(() => {
      setResult(data.items[winIdx]);
      setResultIdx(winIdx);
      setSpinning(false);
    }, 4000);
  };

  const count = data.items.length;
  const segAngle = count > 0 ? 360 / count : 360;

  return (
    <div className="list-container">
      <div className="input-row">
        <input
          type="text"
          className="text-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.nativeEvent.isComposing && addItem()
          }
          placeholder="項目を入力..."
        />
        <button className="secondary-button" onClick={addItem}>
          追加
        </button>
      </div>

      {count > 0 && (
        <div className="wheel-wrapper">
          <div className="wheel-pointer" />
          <div
            ref={wheelRef}
            className="wheel"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                : "none",
            }}
          >
            {data.items.map((item, i) => {
              const startAngle = i * segAngle;
              const color = COLORS[i % COLORS.length];
              return (
                <div
                  key={i}
                  className="wheel-segment"
                  style={{
                    transform: `rotate(${startAngle}deg)`,
                    clipPath:
                      count === 1
                        ? "none"
                        : `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.tan(((segAngle / 2) * Math.PI) / 180)}% 0%)`,
                  }}
                >
                  <div
                    className="wheel-segment-fill"
                    style={{
                      background: color,
                      transform:
                        count === 1 ? "none" : `rotate(${segAngle / 2}deg)`,
                      clipPath:
                        count === 1
                          ? "none"
                          : `polygon(50% 50%, 50% 0%, ${50 - 50 * Math.tan(((segAngle / 2) * Math.PI) / 180)}% 0%)`,
                    }}
                  />
                  <span
                    className="wheel-label"
                    style={{
                      transform: `rotate(${segAngle / 2}deg) translateY(-55px)`,
                    }}
                  >
                    {item.length > 6 ? item.slice(0, 6) + "…" : item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {count > 0 && (
        <div className="wheel-items-compact">
          {data.items.map((item, i) => (
            <span key={i} className="wheel-item-tag">
              <span
                className="wheel-item-dot"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              {item}
              <button className="remove-button" onClick={() => removeItem(i)}>
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      <button
        className="primary-button"
        onClick={spin}
        disabled={count === 0 || spinning}
        style={{ padding: "12px" }}
      >
        {spinning ? "選出中..." : "回す"}
      </button>

      {result !== null && !spinning && (
        <div className="result-area">
          <div className="result-display-sm">{result}</div>
          {resultIdx !== null && (
            <button
              className="remove-result-button"
              onClick={() => {
                removeItem(resultIdx);
                setResult(null);
                setResultIdx(null);
              }}
            >
              この項目を除外する
            </button>
          )}
        </div>
      )}
    </div>
  );
}
