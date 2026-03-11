import { useState, useCallback } from "react";
import type { DiceData } from "../types";
import { useI18n } from "../i18n";

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
  const { t } = useI18n();
  const [results, setResults] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const diceCount = data.count ?? 1;

  const roll = useCallback(() => {
    if (rolling) return;
    setRolling(true);

    let count = 0;
    const interval = setInterval(() => {
      setResults(
        Array.from(
          { length: diceCount },
          () => Math.floor(Math.random() * data.faces) + 1,
        ),
      );
      count++;
      if (count >= 12) {
        clearInterval(interval);
        setResults(
          Array.from(
            { length: diceCount },
            () => Math.floor(Math.random() * data.faces) + 1,
          ),
        );
        setRolling(false);
        setAnimKey((k) => k + 1);
      }
    }, 60);
  }, [rolling, data.faces, diceCount]);

  const showPips = data.faces <= 6;
  const total = results.reduce((a, b) => a + b, 0);

  return (
    <div className="dice-container">
      <div className="dice-settings-row">
        <label className="dice-label">
          {t("dice.faces")}
          <input
            type="number"
            className="number-input"
            min={2}
            max={100}
            value={data.faces}
            onChange={(e) => {
              const faces = Math.max(2, parseInt(e.target.value) || 2);
              onUpdate({ ...data, faces });
            }}
          />
        </label>
        <label className="dice-label">
          {t("dice.count")}
          <input
            type="number"
            className="number-input"
            min={1}
            max={10}
            value={diceCount}
            onChange={(e) => {
              const c = Math.max(
                1,
                Math.min(10, parseInt(e.target.value) || 1),
              );
              onUpdate({ ...data, count: c });
            }}
          />
        </label>
      </div>

      <div className="dice-results">
        {results.length > 0 ? (
          results.map((val, i) => (
            <div
              key={`${animKey}-${i}`}
              className={`dice-face ${rolling ? "dice-rolling" : ""}`}
              style={{
                width: diceCount > 4 ? 70 : diceCount > 2 ? 90 : 120,
                height: diceCount > 4 ? 70 : diceCount > 2 ? 90 : 120,
              }}
            >
              {showPips && val <= 6 ? (
                <div className="dice-pips">
                  {PIP_LAYOUTS[val].map(([x, y], j) => (
                    <div
                      key={j}
                      className="dice-pip"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        width: diceCount > 4 ? 10 : diceCount > 2 ? 14 : 18,
                        height: diceCount > 4 ? 10 : diceCount > 2 ? 14 : 18,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <span
                  className="dice-number"
                  style={{
                    fontSize: diceCount > 4 ? 28 : diceCount > 2 ? 36 : 52,
                  }}
                >
                  {val}
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="dice-face" style={{ width: 120, height: 120 }}>
            <span className="dice-question">?</span>
          </div>
        )}
      </div>

      {results.length > 1 && !rolling && (
        <div className="dice-total">
          {t("dice.total")}: {total}
        </div>
      )}

      <button className="primary-button" onClick={roll} disabled={rolling}>
        {rolling ? t("dice.rolling") : t("dice.roll")}
      </button>
    </div>
  );
}
