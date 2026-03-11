import { useState } from "react";
import type { DiceData } from "../types";

interface Props {
  data: DiceData;
  onUpdate: (data: DiceData) => void;
}

export function Dice({ data, onUpdate }: Props) {
  const [result, setResult] = useState<number | null>(null);

  const roll = () => {
    setResult(Math.floor(Math.random() * data.faces) + 1);
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
      <button className="primary-button" onClick={roll}>
        振る
      </button>
      {result !== null && <div className="result-display">{result}</div>}
    </div>
  );
}
