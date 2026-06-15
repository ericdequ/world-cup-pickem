"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Prediction, Score } from "@/lib/types";
import { useLocalStorage } from "./useLocalStorage";
import { useAuth } from "./useAuth";
import {
  fetchPredictions,
  upsertPrediction,
  deletePrediction,
} from "@/lib/data/predictionsRepo";

const STORAGE_KEY = "wc-pickem:predictions";
const EMPTY: Record<string, Prediction> = {};

type Predictions = Record<string, Prediction>;

const newer = (a: Prediction, b: Prediction) =>
  new Date(a.submittedAt).getTime() >= new Date(b.submittedAt).getTime() ? a : b;

/** Merge two prediction maps, keeping the most recently submitted pick per match. */
function mergeNewest(local: Predictions, cloud: Predictions): Predictions {
  const merged: Predictions = { ...cloud };
  for (const [matchId, p] of Object.entries(local)) {
    merged[matchId] = cloud[matchId] ? newer(p, cloud[matchId]) : p;
  }
  return merged;
}

/**
 * The user's match predictions, keyed by matchId.
 *
 * - **Always** persisted on-device (works offline / signed out).
 * - When signed in, the local set is merged with the cloud on first load
 *   (newest pick wins) and every change is written through to Supabase, so
 *   picks follow the user across devices.
 *
 * Locking is enforced separately in the UI via `isLocked`; this hook only
 * records picks.
 */
export function usePredictions() {
  const { user } = useAuth();
  const [predictions, setPredictions] = useLocalStorage<Predictions>(STORAGE_KEY, EMPTY);

  // Keep the latest local value reachable inside the one-shot sync effect
  // without making it an effect dependency (which would re-run the merge).
  const localRef = useRef(predictions);
  useEffect(() => {
    localRef.current = predictions;
  }, [predictions]);
  const syncedUserId = useRef<string | null>(null);

  // One-time reconcile when a user signs in.
  useEffect(() => {
    if (!user) {
      syncedUserId.current = null;
      return;
    }
    if (syncedUserId.current === user.id) return;
    syncedUserId.current = user.id;

    (async () => {
      const cloud = await fetchPredictions(user.id);
      const merged = mergeNewest(localRef.current, cloud);
      setPredictions(merged);

      // Push picks that are new or newer locally up to the cloud.
      const toPush = Object.values(merged).filter((p) => {
        const c = cloud[p.matchId];
        return !c || new Date(p.submittedAt) > new Date(c.submittedAt);
      });
      await Promise.all(toPush.map((p) => upsertPrediction(user.id, p).catch(() => {})));
    })();
  }, [user, setPredictions]);

  const setPrediction = useCallback(
    (matchId: string, score: Score) => {
      const prediction: Prediction = { matchId, score, submittedAt: new Date().toISOString() };
      setPredictions((prev) => ({ ...prev, [matchId]: prediction }));
      if (user) upsertPrediction(user.id, prediction).catch(() => {});
    },
    [user, setPredictions],
  );

  const clearPrediction = useCallback(
    (matchId: string) => {
      setPredictions((prev) => {
        const next = { ...prev };
        delete next[matchId];
        return next;
      });
      if (user) deletePrediction(user.id, matchId).catch(() => {});
    },
    [user, setPredictions],
  );

  return { predictions, setPrediction, clearPrediction };
}
