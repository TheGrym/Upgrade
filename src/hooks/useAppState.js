import { useState, useCallback } from "react";
import { load, save, initialState } from "../lib/storage.js";

export function useAppState() {
  const [state, setStateRaw] = useState(() => {
    const loaded = load();
    if (!loaded) return initialState();
    return { ...initialState(), ...loaded, prefs: { ...initialState().prefs, ...(loaded.prefs || {}) } };
  });

  const setState = useCallback(updater => {
    setStateRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      save(next);
      return next;
    });
  }, []);

  return [state, setState];
}
