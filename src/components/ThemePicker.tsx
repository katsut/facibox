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
  const [shuffling, setShuffling] = useState(false);
  const [showList, setShowList] = useState(false);
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
    setShuffling(true);
    setResult(null);

    setTimeout(() => {
      setShuffling(false);
      const finalIdx = Math.floor(Math.random() * data.items.length);

      let reveal = 0;
      const revealTick = () => {
        reveal++;
        if (reveal >= 6) {
          setResult(data.items[finalIdx]);
          setPicking(false);
          return;
        }
        setResult(data.items[Math.floor(Math.random() * data.items.length)]);
        timeoutRef.current = setTimeout(revealTick, 100 + reveal * 40);
      };
      revealTick();
    }, 800);
  };

  const cardCount = Math.min(data.items.length, 5);

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
          placeholder="テーマを入力..."
        />
        <button className="secondary-button" onClick={addItem}>
          追加
        </button>
      </div>

      {data.items.length > 0 && (
        <div className="card-deck-area">
          <div className={`card-deck ${shuffling ? "card-shuffling" : ""}`}>
            {Array.from({ length: cardCount }).map((_, i) => (
              <div
                key={i}
                className="card-back"
                style={{
                  transform: `translateX(${(i - Math.floor(cardCount / 2)) * 6}px) rotate(${(i - Math.floor(cardCount / 2)) * 3}deg)`,
                  zIndex: cardCount - i,
                }}
              >
                <span className="card-back-icon">?</span>
              </div>
            ))}
          </div>
          {result !== null && !picking && (
            <div className="card-reveal">
              <div className="card-front">
                <span className="card-front-text">{result}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="theme-meta">
        <span className="theme-count">{data.items.length} 件登録済み</span>
        {data.items.length > 0 && (
          <button
            className="theme-toggle-list"
            onClick={() => setShowList(!showList)}
          >
            {showList ? "一覧を隠す" : "一覧を表示"}
          </button>
        )}
      </div>

      {showList && data.items.length > 0 && (
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
        disabled={data.items.length === 0 || picking}
        style={{ padding: "12px" }}
      >
        {picking ? "選出中..." : "テーマを決める"}
      </button>

      {data.items.length > 0 && (
        <button
          className="reset-all-button"
          onClick={() => {
            if (confirm("テーマをすべて削除しますか？")) {
              onUpdate({ items: [] });
              setResult(null);
              setShowList(false);
            }
          }}
        >
          テーマをすべて削除
        </button>
      )}
    </div>
  );
}
