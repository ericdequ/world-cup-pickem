import type { Match, Prediction, Score } from "./types";

/** Outcome of a score from the home team's perspective. */
const outcome = (s: Score): -1 | 0 | 1 =>
  s.home > s.away ? 1 : s.home < s.away ? -1 : 0;

/** Was the prediction saved before kickoff? Full points require this. */
const submittedBeforeKickoff = (prediction: Prediction, match: Match): boolean =>
  new Date(prediction.submittedAt).getTime() < new Date(match.kickoff).getTime();

/**
 * Predictions lock at kickoff. Once locked the pick can't be changed — the
 * single most important fairness rule, so it lives in one pure function.
 */
export const isLocked = (match: Match, now: Date = new Date()): boolean =>
  match.status !== "scheduled" || now.getTime() >= new Date(match.kickoff).getTime();

/** Milliseconds until a match locks (0 if already locked). */
export const msUntilLock = (match: Match, now: Date = new Date()): number =>
  Math.max(0, new Date(match.kickoff).getTime() - now.getTime());

/**
 * Score a single prediction against a finished match.
 *   3 — exact score (submitted before kickoff)
 *   1 — correct result, or exact score submitted after kickoff
 *   0 — otherwise / match not finished
 */
export function scorePrediction(prediction: Prediction, match: Match): number {
  if (!match.result) return 0;

  const exact =
    prediction.score.home === match.result.home &&
    prediction.score.away === match.result.away;
  const beforeKickoff = submittedBeforeKickoff(prediction, match);

  if (exact) return beforeKickoff ? 3 : 1;
  if (beforeKickoff && outcome(prediction.score) === outcome(match.result)) return 1;
  return 0;
}

/** Total points across a set of predictions for the matches they reference. */
export function totalPoints(
  predictions: Record<string, Prediction>,
  matches: Match[],
): number {
  const byId = new Map(matches.map((m) => [m.id, m]));
  return Object.values(predictions).reduce((sum, p) => {
    const match = byId.get(p.matchId);
    return match ? sum + scorePrediction(p, match) : sum;
  }, 0);
}
