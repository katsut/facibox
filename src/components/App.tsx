import { useMemo, useState } from "react";
import type { TabId } from "../types";
import { useStorage } from "../hooks/useStorage";
import { useTimer } from "../hooks/useTimer";
import { I18nContext, createT, type Locale } from "../i18n";
import { Modal } from "./Modal";
import { TabNav } from "./TabNav";
import { Dice } from "./Dice";
import { Roulette } from "./Roulette";
import { Timer } from "./Timer";
import { ThemePicker } from "./ThemePicker";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function App({ visible, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("dice");
  const [collapsed, setCollapsed] = useState(false);
  const [locale, setLocale] = useState<Locale>(
    (navigator.language.startsWith("ja") ? "ja" : "en") as Locale,
  );
  const { data, loaded, update } = useStorage();
  const timer = useTimer({
    initialMinutes: data?.timer.minutes ?? 5,
    initialSeconds: data?.timer.seconds ?? 0,
  });

  const i18n = useMemo(
    () => ({ t: createT(locale), locale, setLocale }),
    [locale],
  );

  if (!loaded) return null;

  return (
    <I18nContext.Provider value={i18n}>
      <Modal
        visible={visible}
        collapsed={collapsed}
        hideBody={collapsed && activeTab !== "timer"}
        onClose={onClose}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        timer={timer}
        onTimerTab={() => {
          setActiveTab("timer");
          setCollapsed(false);
        }}
      >
        {!collapsed && (
          <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
        )}
        <div className="tab-content">
          {activeTab === "dice" && (
            <Dice data={data.dice} onUpdate={(dice) => update({ dice })} />
          )}
          {activeTab === "roulette" && (
            <Roulette
              data={data.roulette}
              onUpdate={(roulette) => update({ roulette })}
            />
          )}
          {activeTab === "timer" && (
            <Timer
              data={data.timer}
              onUpdate={(t) => update({ timer: t })}
              collapsed={collapsed}
              timer={timer}
            />
          )}
          {activeTab === "theme" && (
            <ThemePicker
              data={data.theme}
              onUpdate={(theme) => update({ theme })}
            />
          )}
        </div>
      </Modal>
    </I18nContext.Provider>
  );
}
