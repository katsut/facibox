import { createContext, useContext } from "react";

export type Locale = "ja" | "en";

const translations = {
  ja: {
    // Tabs
    "tab.dice": "ダイス",
    "tab.roulette": "ルーレット",
    "tab.timer": "タイマー",
    "tab.theme": "テーマ",

    // Common
    "common.add": "追加",
    "common.next": "次へ →",
    "common.start": "始める →",
    "common.edit": "← 編集",
    "common.close": "閉じる",
    "common.save": "保存",
    "common.reset": "リセット",

    // Dice
    "dice.faces": "面数",
    "dice.count": "個数",
    "dice.roll": "振る",
    "dice.rolling": "...",
    "dice.total": "合計",

    // Roulette
    "roulette.inputPlaceholder": "項目を入力...",
    "roulette.spin": "回す",
    "roulette.spinning": "選出中...",
    "roulette.autoRemove": "当たった項目を自動で削除する",
    "roulette.deleteAll": "項目をすべて削除",
    "roulette.deleteAllConfirm": "ルーレットの項目をすべて削除しますか？",

    // Timer
    "timer.minutes": "分",
    "timer.seconds": "秒",
    "timer.start": "スタート",
    "timer.stop": "ストップ",
    "timer.sound": "終了時に音を鳴らす",

    // Theme
    "theme.inputPlaceholder": "テーマを個別に追加...",
    "theme.pick": "テーマを決める",
    "theme.picking": "選出中...",
    "theme.deleteThis": "このテーマを削除",
    "theme.deleteAll": "テーマをすべて削除",
    "theme.deleteAllConfirm": "テーマをすべて削除しますか？",
    "theme.registered": "件登録済み",
    "theme.showList": "一覧を表示",
    "theme.hideList": "一覧を隠す",

    // Preset
    "preset.title": "プリセット",
    "preset.create": "新規作成",
    "preset.namePlaceholder": "プリセット名",
    "preset.itemsPlaceholder":
      "テーマを改行区切りで入力...\n例:\nアイスブレイク\n振り返り\nブレスト",
    "preset.deleteConfirm": "プリセット「{name}」を削除しますか？",
    "preset.count": "{n}件",

    // Settings
    "settings.language": "言語",
  },
  en: {
    // Tabs
    "tab.dice": "Dice",
    "tab.roulette": "Roulette",
    "tab.timer": "Timer",
    "tab.theme": "Theme",

    // Common
    "common.add": "Add",
    "common.next": "Next →",
    "common.start": "Start →",
    "common.edit": "← Edit",
    "common.close": "Close",
    "common.save": "Save",
    "common.reset": "Reset",

    // Dice
    "dice.faces": "Faces",
    "dice.count": "Count",
    "dice.roll": "Roll",
    "dice.rolling": "...",
    "dice.total": "Total",

    // Roulette
    "roulette.inputPlaceholder": "Enter item...",
    "roulette.spin": "Spin",
    "roulette.spinning": "Spinning...",
    "roulette.autoRemove": "Auto-remove winner",
    "roulette.deleteAll": "Delete all items",
    "roulette.deleteAllConfirm": "Delete all roulette items?",

    // Timer
    "timer.minutes": "Min",
    "timer.seconds": "Sec",
    "timer.start": "Start",
    "timer.stop": "Stop",
    "timer.sound": "Play sound when finished",

    // Theme
    "theme.inputPlaceholder": "Add theme...",
    "theme.pick": "Pick Theme",
    "theme.picking": "Picking...",
    "theme.deleteThis": "Delete this theme",
    "theme.deleteAll": "Delete all themes",
    "theme.deleteAllConfirm": "Delete all themes?",
    "theme.registered": "registered",
    "theme.showList": "Show list",
    "theme.hideList": "Hide list",

    // Preset
    "preset.title": "Presets",
    "preset.create": "Create",
    "preset.namePlaceholder": "Preset name",
    "preset.itemsPlaceholder":
      "Enter themes (one per line)...\ne.g.:\nIcebreaker\nRetrospective\nBrainstorm",
    "preset.deleteConfirm": 'Delete preset "{name}"?',
    "preset.count": "{n}",

    // Settings
    "settings.language": "Language",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["ja"];

export type TFunction = (
  key: TranslationKey,
  params?: Record<string, string | number>,
) => string;

export function createT(locale: Locale): TFunction {
  return (key, params) => {
    let text: string = translations[locale][key] ?? translations.ja[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, String(v));
      }
    }
    return text;
  };
}

export const I18nContext = createContext<{
  t: TFunction;
  locale: Locale;
  setLocale: (l: Locale) => void;
}>({
  t: createT("ja"),
  locale: "ja",
  setLocale: () => {},
});

export function useI18n() {
  return useContext(I18nContext);
}
