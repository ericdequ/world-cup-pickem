"use client";

import { useCallback } from "react";
import type { Prediction, Score } from "@/lib/types";
import { useLocalStorage } from "./useLocalStorage";

const STORAGE_KEY = "wc-pickem:predictions";
const EMPTY: Record<string, Prediction> = {};

/**
 * The user's match predictions, keyed by matchId. Persisted on-device now;
 * once signed in, these sync to Supabase (see `lib/supabase`). Locking is
 * enforced at the UI layer via `isLocked` — this store just records picks.
 */
export function usePredictions() {
  const [predictions, setPredictions] = useLocalStorage<Record<string, Prediction>>(
    STORAGE_KEY,
    EMPTY,
  );

  const setPrediction = useCallback(
    (matchId: string, score: Score) =>
      setPredictions((prev) => ({
        ...prev,
        [matchId]: { matchId, score, submittedAt: new Date().toISOString() },
      })),
    [setPredictions],
  );

  const clearPrediction = useCallback(
    (matchId: string) =>
      setPredictions((prev) => {
        const next = { ...prev };
        delete next[matchId];
        return next;
      }),
    [setPredictions],
  );

  return { predictions, setPrediction, clearPrediction };
}
