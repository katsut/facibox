import type { TabId } from "../types";
import { useI18n } from "../i18n";
import type { TranslationKey } from "../i18n";

const TAB_IDS: TabId[] = ["dice", "roulette", "timer", "theme"];
const TAB_KEYS: Record<TabId, TranslationKey> = {
  dice: "tab.dice",
  roulette: "tab.roulette",
  timer: "tab.timer",
  theme: "tab.theme",
};

interface Props {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabNav({ activeTab, onTabChange }: Props) {
  const { t } = useI18n();

  return (
    <nav className="tab-nav">
      {TAB_IDS.map((id) => (
        <button
          key={id}
          className={`tab-button ${activeTab === id ? "active" : ""}`}
          onClick={() => onTabChange(id)}
        >
          {t(TAB_KEYS[id])}
        </button>
      ))}
    </nav>
  );
}
