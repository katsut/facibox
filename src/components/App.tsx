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
  const { data, loaded, update, reset } = useStorage();

  if (!loaded) return null;

  const handleReset = () => {
    if (confirm("すべてのデータをリセットしますか？")) {
      reset();
    }
  };

  return (
    <Modal visible={visible} onClose={onClose}>
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
      <button className="reset-all-button" onClick={handleReset}>
        データをリセット
      </button>
    </Modal>
  );
}
