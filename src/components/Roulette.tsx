import { useState, useRef } from "react";
import type { RouletteData } from "../types";

interface Props {
  data: RouletteData;
  onUpdate: (data: RouletteData) => void;
}

export function Roulette({ data, onUpdate }: Props) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [spinDisplay, setSpinDisplay] = useState("");
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);
  const spinRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addItem = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onUpdate({ items: [...data.items, trimmed] });
    setInput("");
  };

  const removeItem = (index: number) => {
    onUpdate({ items: data.items.filter((_, i) => i !== index) });
  };

  const spin = () => {
    if (data.items.length === 0 || spinning) return;
    setSpinning(true);
    setResult(null);
    setHighlightIdx(null);

    let delay = 50;
    let step = 0;
    const totalSteps = 20;

    const tick = () => {
      const idx = Math.floor(Math.random() * data.items.length);
      setSpinDisplay(data.items[idx]);
      step++;

      if (step >= totalSteps) {
        const finalIdx = Math.floor(Math.random() * data.items.length);
        setSpinDisplay("");
        setResult(data.items[finalIdx]);
        setHighlightIdx(finalIdx);
        setSpinning(false);
        return;
      }

      delay += step * 8;
      spinRef.current = setTimeout(tick, delay);
    };

    tick();
  };

  return (
    <div className="list-container">
      <div className="input-row">
        <input
          type="text"
          className="text-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder="項目を入力..."
        />
        <button className="secondary-button" onClick={addItem}>
          追加
        </button>
      </div>
      {data.items.length > 0 && (
        <ul className="item-list">
          {data.items.map((item, i) => (
            <li key={i} className={highlightIdx === i ? "highlighted" : ""}>
              <span>{item}</span>
              <button className="remove-button" onClick={() => removeItem(i)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
      {spinning && <div className="spin-overlay">{spinDisplay}</div>}
      <button
        className="primary-button"
        onClick={spin}
        disabled={data.items.length === 0 || spinning}
        style={{ padding: "12px" }}
      >
        {spinning ? "選出中..." : "回す"}
      </button>
      {result !== null && !spinning && (
        <div className="result-display-sm">{result}</div>
      )}
    </div>
  );
}
