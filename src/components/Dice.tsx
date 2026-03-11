import { useState, useCallback } from "react";
import type { DiceData } from "../types";

interface Props {
  data: DiceData;
  onUpdate: (data: DiceData) => void;
}

const PIP_LAYOUTS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [
    [25, 25],
    [75, 75],
  ],
  3: [
    [25, 25],
    [50, 50],
    [75, 75],
  ],
  4: [
    [25, 25],
    [75, 25],
    [25, 75],
    [75, 75],
  ],
  5: [
    [25, 25],
    [75, 25],
    [50, 50],
    [25, 75],
    [75, 75],
  ],
  6: [
    [25, 25],
    [75, 25],
    [25, 50],
    [75, 50],
    [25, 75],
    [75, 75],
  ],
};

export function Dice({ data, onUpdate }: Props) {
  const [result, setResult] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const roll = useCallback(() => {
    if (rolling) return;
    setRolling(true);

    let count = 0;
    const interval = setInterval(() => {
      setResult(Math.floor(Math.random() * data.faces) + 1);
      count++;
      if (count >= 12) {
        clearInterval(interval);
        const final = Math.floor(Math.random() * data.faces) + 1;
        setResult(final);
        setRolling(false);
        setAnimKey((k) => k + 1);
      }
    }, 60);
  }, [rolling, data.faces]);

  const showPips = result !== null && result <= 6 && data.faces <= 6;

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

      <div className={`dice-face ${rolling ? "dice-rolling" : ""}`}>
        {result !== null ? (
          showPips ? (
            <div key={animKey} className="dice-pips">
              {PIP_LAYOUTS[result].map(([x, y], i) => (
                <div
                  key={i}
                  className="dice-pip"
                  style={{ left: `${x}%`, top: `${y}%` }}
                />
              ))}
            </div>
          ) : (
            <span key={animKey} className="dice-number">
              {result}
            </span>
          )
        ) : (
          <span className="dice-question">?</span>
        )}
      </div>

      <button className="primary-button" onClick={roll} disabled={rolling}>
        {rolling ? "..." : "振る"}
      </button>
    </div>
  );
}
