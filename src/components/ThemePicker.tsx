import { useState } from "react";
import type { ThemeData } from "../types";

interface Props {
  data: ThemeData;
  onUpdate: (data: ThemeData) => void;
}

export function ThemePicker({ data, onUpdate }: Props) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);

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
    if (data.items.length === 0) return;
    const idx = Math.floor(Math.random() * data.items.length);
    setResult(data.items[idx]);
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
            <li key={i}>
              <span>{item}</span>
              <button className="remove-button" onClick={() => removeItem(i)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        className="primary-button"
        onClick={pick}
        disabled={data.items.length === 0}
        style={{ padding: "12px" }}
      >
        テーマを決める
      </button>
      {result !== null && <div className="result-display-sm">{result}</div>}
    </div>
  );
}
