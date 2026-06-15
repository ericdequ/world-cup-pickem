import { supabase } from "@/lib/supabase/client";
import type { Prediction } from "@/lib/types";

/**
 * Cloud persistence for predictions (Supabase `public.predictions`, RLS-protected).
 * Every function no-ops / returns empty when Supabase isn't configured, so callers
 * can treat the cloud as an optional layer on top of local storage.
 */

interface PredictionRow {
  match_id: string;
  home_score: number;
  away_score: number;
  submitted_at: string;
}

const rowToPrediction = (r: PredictionRow): Prediction => ({
  matchId: r.match_id,
  score: { home: r.home_score, away: r.away_score },
  submittedAt: r.submitted_at,
});

/** All of a user's predictions, keyed by matchId. */
export async function fetchPredictions(userId: string): Promise<Record<string, Prediction>> {
  if (!supabase) return {};
  const { data, error } = await supabase
    .from("predictions")
    .select("match_id, home_score, away_score, submitted_at")
    .eq("user_id", userId);
  if (error || !data) return {};

  const out: Record<string, Prediction> = {};
  for (const row of data as PredictionRow[]) out[row.match_id] = rowToPrediction(row);
  return out;
}

/**
 * Insert or update a single prediction. `submitted_at` is intentionally NOT sent:
 * the database trigger server-stamps it and rejects the write if the match has
 * already kicked off (see migration 0003) — the authoritative, non-spoofable lock.
 * A rejected write throws; callers treat that as "locked".
 */
export async function upsertPrediction(userId: string, p: Prediction): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("predictions").upsert({
    user_id: userId,
    match_id: p.matchId,
    home_score: p.score.home,
    away_score: p.score.away,
  });
  if (error) throw error;
}

/** Remove a prediction. */
export async function deletePrediction(userId: string, matchId: string): Promise<void> {
  if (!supabase) return;
  await supabase.from("predictions").delete().eq("user_id", userId).eq("match_id", matchId);
}
