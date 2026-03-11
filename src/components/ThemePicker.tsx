import { useState, useRef } from "react";
import type { ThemeData } from "../types";

interface Props {
  data: ThemeData;
  onUpdate: (data: ThemeData) => void;
}

export function ThemePicker({ data, onUpdate }: Props) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [shuffleDisplay, setShuffleDisplay] = useState("");
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addItem = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onUpdate({ items: [...data.items, trimmed] });
    setInput("");
  };

  const removeItem = (index: number) => {
    onUpdate({ items: data.items.filter((_, i) => i !== index) });
  };

  const pick = () => {
    if (data.items.length === 0 || picking) return;
    setPicking(true);
    setResult(null);
    setHighlightIdx(null);

    let delay = 50;
    let step = 0;
    const totalSteps = 15;

    const tick = () => {
      const idx = Math.floor(Math.random() * data.items.length);
      setShuffleDisplay(data.items[idx]);
      step++;

      if (step >= totalSteps) {
        const finalIdx = Math.floor(Math.random() * data.items.length);
        setShuffleDisplay("");
        setResult(data.items[finalIdx]);
        setHighlightIdx(finalIdx);
        setPicking(false);
        return;
      }

      delay += step * 12;
      timeoutRef.current = setTimeout(tick, delay);
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
          placeholder="テーマを入力..."
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
      {picking && <div className="spin-overlay">{shuffleDisplay}</div>}
      <button
        className="primary-button"
        onClick={pick}
        disabled={data.items.length === 0 || picking}
        style={{ padding: "12px" }}
      >
        {picking ? "選出中..." : "テーマを決める"}
      </button>
      {result !== null && !picking && (
        <div className="result-display-sm">{result}</div>
      )}
    </div>
  );
}
