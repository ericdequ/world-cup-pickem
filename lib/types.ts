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

/* ------------------------------------------------------------------ *
 * Matches, predictions, lineups & players (free-API data layer)
 * ------------------------------------------------------------------ */

/** Tournament stage. Covers the full run: group stage through the final. */
export type Stage =
  | "group"
  | "round-of-32"
  | "round-of-16"
  | "quarter-final"
  | "semi-final"
  | "third-place"
  | "final";

export const STAGE_LABELS: Record<Stage, string> = {
  group: "Group Stage",
  "round-of-32": "Round of 32",
  "round-of-16": "Round of 16",
  "quarter-final": "Quarter-finals",
  "semi-final": "Semi-finals",
  "third-place": "Third-place Play-off",
  final: "Final",
};

export type MatchStatus = "scheduled" | "live" | "finished";

export interface Team {
  id: string;
  name: string;
  /** 3-letter code shown in compact UI, e.g. "BRA". */
  code: string;
  /** Crest/flag image URL, if the data source provides one. */
  badge?: string;
  group?: string;
}

export interface Match {
  id: string;
  stage: Stage;
  group?: string;
  home: Team;
  away: Team;
  /** Kickoff time, ISO 8601. Drives prediction locking. */
  kickoff: string;
  venue?: string;
  status: MatchStatus;
  /** Actual score once known (used for scoring predictions). */
  result?: Score;
}

export interface Score {
  home: number;
  away: number;
}

/** A user's predicted score for a single match. */
export interface Prediction {
  matchId: string;
  score: Score;
  /** When the prediction was last saved (ISO). Used for the post-kickoff rule. */
  submittedAt: string;
}

/** A single player within a lineup. */
export interface LineupPlayer {
  id: string;
  name: string;
  number?: number;
  position?: string;
}

export interface Lineup {
  matchId: string;
  formation?: string;
  home: LineupPlayer[];
  away: LineupPlayer[];
}

/** Player bio for the research view. */
export interface PlayerProfile {
  id: string;
  name: string;
  team?: string;
  nationality?: string;
  position?: string;
  thumb?: string;
  description?: string;
}

/* ------------------------------------------------------------------ *
 * Global tournament & on-chain pot
 * ------------------------------------------------------------------ */

/** A public, paid competition anyone can join (vs. the private friends pool). */
export interface GlobalTournament {
  id: string;
  name: string;
  /** Entry fee in USDC. */
  entryFee: number;
  /** Operator rake as a fraction (e.g. 0.1 = 10%). */
  rake: number;
  /** Total entrants. */
  entrants: number;
  /** On-chain pot balance in USDC. */
  potUsdc: number;
  /** Escrow contract address on Base (read-only, for transparency). */
  contractAddress?: string;
  chain: "base" | "base-sepolia";
}
