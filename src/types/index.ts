export interface DiceData {
  faces: number;
  count?: number;
}

export interface RouletteData {
  items: string[];
}

export interface TimerData {
  minutes: number;
  seconds: number;
}

export interface ThemePreset {
  name: string;
  items: string[];
}

export interface ThemeData {
  items: string[];
  presets?: ThemePreset[];
}

export interface FaciBoxData {
  dice: DiceData;
  roulette: RouletteData;
  timer: TimerData;
  theme: ThemeData;
}

export const DEFAULT_DATA: FaciBoxData = {
  dice: { faces: 6 },
  roulette: { items: [] },
  timer: { minutes: 5, seconds: 0 },
  theme: { items: [] },
};

export type TabId = "dice" | "roulette" | "timer" | "theme";
