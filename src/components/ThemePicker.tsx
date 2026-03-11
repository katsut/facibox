import { useState, useRef } from "react";
import type { ThemeData, ThemePreset } from "../types";
import { useI18n } from "../i18n";

interface Props {
  data: ThemeData;
  onUpdate: (data: ThemeData) => void;
}

export function ThemePicker({ data, onUpdate }: Props) {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [resultIdx, setResultIdx] = useState<number | null>(null);
  const [picking, setPicking] = useState(false);
  const [decided, setDecided] = useState(false);
  const [shuffling, setShuffling] = useState(false);
  const [removingIdx, setRemovingIdx] = useState<number | null>(null);
  const [showPresetEditor, setShowPresetEditor] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [presetItems, setPresetItems] = useState("");
  const [editing, setEditing] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const presets = data.presets ?? [];

  const addItem = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onUpdate({ ...data, items: [...data.items, trimmed] });
    setInput("");
  };

  const removeItem = (index: number) => {
    setRemovingIdx(index);
    setTimeout(() => {
      onUpdate({ ...data, items: data.items.filter((_, i) => i !== index) });
      setRemovingIdx(null);
    }, 250);
  };

  const pick = () => {
    if (data.items.length === 0 || picking) return;
    setPicking(true);
    setShuffling(true);
    setResult(null);
    setResultIdx(null);
    setDecided(false);

    setTimeout(() => {
      setShuffling(false);
      const finalIdx = Math.floor(Math.random() * data.items.length);

      let reveal = 0;
      const revealTick = () => {
        reveal++;
        if (reveal >= 6) {
          setResult(data.items[finalIdx]);
          setResultIdx(finalIdx);
          setPicking(false);
          setDecided(true);
          return;
        }
        setResult(data.items[Math.floor(Math.random() * data.items.length)]);
        timeoutRef.current = setTimeout(revealTick, 100 + reveal * 40);
      };
      revealTick();
    }, 800);
  };

  const removeResult = () => {
    if (resultIdx !== null) {
      onUpdate({
        ...data,
        items: data.items.filter((_, i) => i !== resultIdx),
      });
    }
    setResult(null);
    setResultIdx(null);
    setDecided(false);
  };

  const savePreset = () => {
    const name = presetName.trim();
    const items = presetItems
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!name || items.length === 0) return;
    const newPreset: ThemePreset = { name, items };
    onUpdate({ ...data, presets: [...presets, newPreset] });
    setPresetName("");
    setPresetItems("");
    setShowPresetEditor(false);
  };

  const loadPreset = (preset: ThemePreset) => {
    onUpdate({ ...data, items: [...preset.items] });
    setResult(null);
    setResultIdx(null);
    setDecided(false);
    setEditing(false);
  };

  const deletePreset = (index: number) => {
    if (!confirm(t("preset.deleteConfirm", { name: presets[index].name })))
      return;
    onUpdate({ ...data, presets: presets.filter((_, i) => i !== index) });
  };

  const cardCount = Math.min(data.items.length, 5);
  const showEditor = editing || data.items.length === 0;

  return (
    <div className="list-container">
      {data.items.length > 0 && (
        <button className="mode-toggle" onClick={() => setEditing(!editing)}>
          {showEditor ? t("common.start") : t("common.edit")}
        </button>
      )}

      {showEditor ? (
        <>
          <div className="preset-section">
            <div className="preset-header">
              <span className="preset-title">{t("preset.title")}</span>
              <button
                className="theme-toggle-list"
                onClick={() => setShowPresetEditor(!showPresetEditor)}
              >
                {showPresetEditor ? t("common.close") : t("preset.create")}
              </button>
            </div>

            {presets.length > 0 && (
              <div className="preset-list">
                {presets.map((preset, i) => (
                  <div key={i} className="preset-item">
                    <button
                      className="preset-load-button"
                      onClick={() => loadPreset(preset)}
                    >
                      {preset.name}
                      <span className="preset-item-count">
                        {t("preset.count", { n: preset.items.length })}
                      </span>
                    </button>
                    <button
                      className="remove-button"
                      onClick={() => deletePreset(i)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showPresetEditor && (
              <div className="preset-editor">
                <input
                  type="text"
                  className="text-input"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder={t("preset.namePlaceholder")}
                />
                <textarea
                  className="preset-textarea"
                  value={presetItems}
                  onChange={(e) => setPresetItems(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder={t("preset.itemsPlaceholder")}
                  rows={5}
                />
                <button
                  className="secondary-button"
                  onClick={savePreset}
                  disabled={!presetName.trim() || !presetItems.trim()}
                >
                  {t("common.save")}
                </button>
              </div>
            )}
          </div>

          <div className="input-row">
            <input
              type="text"
              className="text-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.nativeEvent.isComposing && addItem()
              }
              placeholder={t("theme.inputPlaceholder")}
            />
            <button className="secondary-button" onClick={addItem}>
              {t("common.add")}
            </button>
          </div>

          {data.items.length > 0 && (
            <button
              className="reset-all-button"
              onClick={() => {
                if (confirm(t("theme.deleteAllConfirm"))) {
                  onUpdate({ ...data, items: [] });
                  setResult(null);
                }
              }}
            >
              {t("theme.deleteAll")}
            </button>
          )}

          {data.items.length > 0 && (
            <ul className="item-list">
              {data.items.map((item, i) => (
                <li key={i} className={removingIdx === i ? "removing" : ""}>
                  <span>{item}</span>
                  <button
                    className="remove-button"
                    onClick={() => removeItem(i)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
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
            <span className="theme-count">
              {data.items.length} {t("theme.registered")}
            </span>
          </div>

          {decided ? (
            <div className="theme-decided-actions">
              <button className="secondary-button" onClick={removeResult}>
                {t("theme.deleteThis")}
              </button>
              <button className="next-button" onClick={() => setDecided(false)}>
                {t("common.next")}
              </button>
            </div>
          ) : (
            <button
              className="primary-button"
              onClick={pick}
              disabled={data.items.length === 0 || picking}
              style={{ padding: "12px" }}
            >
              {picking ? t("theme.picking") : t("theme.pick")}
            </button>
          )}
        </>
      )}
    </div>
  );
}
