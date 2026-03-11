import type { TabId } from "../types";

const TABS: { id: TabId; label: string }[] = [
  { id: "dice", label: "ダイス" },
  { id: "roulette", label: "ルーレット" },
  { id: "timer", label: "タイマー" },
  { id: "theme", label: "テーマ" },
];

interface Props {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabNav({ activeTab, onTabChange }: Props) {
  return (
    <nav className="tab-nav">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
