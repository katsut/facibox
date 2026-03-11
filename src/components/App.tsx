import { useState } from "react";
import type { TabId } from "../types";
import { useStorage } from "../hooks/useStorage";
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
  const { data, loaded, update } = useStorage();

  if (!loaded) return null;

  return (
    <Modal
      visible={visible}
      collapsed={collapsed}
      onClose={onClose}
      onToggleCollapse={() => setCollapsed((c) => !c)}
    >
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
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
          <Timer data={data.timer} onUpdate={(timer) => update({ timer })} />
        )}
        {activeTab === "theme" && (
          <ThemePicker
            data={data.theme}
            onUpdate={(theme) => update({ theme })}
          />
        )}
      </div>
    </Modal>
  );
}
