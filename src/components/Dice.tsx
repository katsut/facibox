import { useState } from "react";
import type { DiceData } from "../types";

interface Props {
  data: DiceData;
  onUpdate: (data: DiceData) => void;
}

export function Dice({ data, onUpdate }: Props) {
  const [result, setResult] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [key, setKey] = useState(0);

  const roll = () => {
    if (rolling) return;
    setRolling(true);

    let count = 0;
    const interval = setInterval(() => {
      setResult(Math.floor(Math.random() * data.faces) + 1);
      count++;
      if (count >= 10) {
        clearInterval(interval);
        setResult(Math.floor(Math.random() * data.faces) + 1);
        setRolling(false);
        setKey((k) => k + 1);
      }
    }, 60);
  };

  return (
    <div className="dice-container">
      <div className="dice-setting">
        <label>
          面数
          <input
            type="number"
            className="number-input"
            min={2}
            max={100}
            value={data.faces}
            onChange={(e) => {
              const faces = Math.max(2, parseInt(e.target.value) || 2);
              onUpdate({ faces });
            }}
          />
        </label>
      </div>
      <div className={`dice-visual ${rolling ? "rolling" : ""}`}>
        {result !== null ? (
          <span key={key} className="dice-value">
            {result}
          </span>
        ) : (
          <span className="dice-placeholder">?</span>
        )}
      </div>
      <button className="primary-button" onClick={roll} disabled={rolling}>
        {rolling ? "..." : "振る"}
      </button>
    </div>
  );
}
