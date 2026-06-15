/** Domain types for the World Cup Pick-Em. */

/** A single entrant in the pool. */
export interface Player {
  id: string;
  name: string;
  /** Whether the entry fee has been paid. */
  paid: boolean;
  /** Points scored per round, index-aligned to {@link TournamentConfig.rounds}. */
  points: number[];
}

/** One line of the scoring system. */
export interface ScoringRule {
  label: string;
  points: number;
  icon: string;
}

/**
 * Everything that changes between tournaments lives here, so spinning up the
 * 2030 edition (or any future event) is a config change — not a rewrite.
 */
export interface TournamentConfig {
  /** Display name, e.g. "FIFA World Cup 2026". */
  edition: string;
  /** Sub-header line shown under the title. */
  tagline: string;
  entryFee: number;
  currency: string;
  /** Ordered round labels. Drives the leaderboard columns and edit form. */
  rounds: string[];
  /** Share of the pot paid to each round winner (0–1). */
  roundWinnerShare: number;
  /** Share of the pot paid to the overall champion (0–1). */
  championShare: number;
  scoring: ScoringRule[];
  rules: string[];
  predictionExamples: string[];
  paymentMethods: string[];
  entryDeadlineNote: string;
  /** Players the board is seeded with on first load. */
  initialPlayers: Player[];
}

/** Top-level navigation tabs. */
export type TabKey = "board" | "rules";
