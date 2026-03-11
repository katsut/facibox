import { useCallback, useEffect, useState } from "react";
import { loadData, resetData, saveData } from "../lib/storage";
import { DEFAULT_DATA, type FaciBoxData } from "../types";

export function useStorage() {
  const [data, setData] = useState<FaciBoxData>(DEFAULT_DATA);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadData().then((d) => {
      setData(d);
      setLoaded(true);
    });
  }, []);

  const update = useCallback((partial: Partial<FaciBoxData>) => {
    setData((prev) => {
      const next = { ...prev, ...partial };
      saveData(next);
      return next;
    });
  }, []);

  const reset = useCallback(async () => {
    const defaults = await resetData();
    setData(defaults);
  }, []);

  return { data, loaded, update, reset };
}
