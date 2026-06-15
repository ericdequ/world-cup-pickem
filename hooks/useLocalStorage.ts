"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

/**
 * SSR-safe persisted state built on `useSyncExternalStore` — the idiomatic way
 * to read an external store (localStorage) without hydration mismatches or
 * setState-in-effect. Renders `initial` on the server and first paint, then
 * reflects stored value. Stays in sync across tabs via the `storage` event.
 */
export function useLocalStorage<T>(key: string, initial: T): [T, SetValue<T>] {
  const subscribe = useCallback(
    (onChange: () => void) => {
      window.addEventListener("storage", onChange);
      return () => window.removeEventListener("storage", onChange);
    },
    [],
  );

  // Snapshot is the raw string so its reference is stable between renders.
  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }, [key]);

  const raw = useSyncExternalStore(subscribe, getSnapshot, () => null);

  const value = useMemo<T>(() => {
    if (raw === null) return initial;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  }, [raw, initial]);

  const setValue = useCallback<SetValue<T>>(
    (next) => {
      try {
        const prevRaw = window.localStorage.getItem(key);
        const prev = prevRaw === null ? initial : (JSON.parse(prevRaw) as T);
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        window.localStorage.setItem(key, JSON.stringify(resolved));
        // Notify subscribers in the current tab (native event is cross-tab only).
        window.dispatchEvent(new StorageEvent("storage", { key }));
      } catch {
        /* quota or unavailable storage — ignore */
      }
    },
    [key, initial],
  );

  return [value, setValue];
}
