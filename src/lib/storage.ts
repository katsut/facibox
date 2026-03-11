import { DEFAULT_DATA, type FaciBoxData } from "../types";

const STORAGE_KEY = "facibox_data";

export async function loadData(): Promise<FaciBoxData> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return (result[STORAGE_KEY] as FaciBoxData | undefined) ?? DEFAULT_DATA;
}

export async function saveData(data: FaciBoxData): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: data });
}

export async function resetData(): Promise<FaciBoxData> {
  await chrome.storage.local.remove(STORAGE_KEY);
  return DEFAULT_DATA;
}
