import type { TournamentConfig } from "./types";

/**
 * The active tournament. To launch a new edition (e.g. the 2030 global paid
 * tournament), swap the values here — no component changes required.
 */
export const tournament: TournamentConfig = {
  edition: "FIFA World Cup 2026",
  tagline: "Group Stage · $25 Entry · Glory Eternal",
  entryFee: 25,
  currency: "USD",
  rounds: ["Round 1", "Round 2", "Round 3"],
  roundWinnerShare: 0.2,
  championShare: 0.4,
  scoring: [
    { label: "Correct result", points: 1, icon: "✓" },
    { label: "Correct exact score", points: 3, icon: "⚽" },
    { label: "Post-kickoff exact (0-0 at HT)", points: 1, icon: "⏱" },
  ],
  rules: [
    "Preselect your pick anytime — you'll get a reminder when lineups drop (~1h before kickoff) so you can revise it",
    "Picks lock automatically at kickoff and can't be changed after",
    "Lock time is verified against trusted server time, so it can't be spoofed",
    "Predictions sent by text in group chat",
    'Format: "BRAvMAR: 2-2" or "MEXvRSA: 3-1 Mexico"',
    "Limit GC chat once prediction time begins",
    "Entry fee due before end of GW1 or you are disqualified",
    "Knockout Round on ESPN app to follow Group Stage",
  ],
  predictionExamples: ['"BRAvMAR: 2-2"', '"MEXvRSA: 3-1 Mexico"'],
  paymentMethods: ["Cash App", "Zelle", "Apple Pay"],
  entryDeadlineNote: "Entry fee must be sent before end of GW1 or you are disqualified",
  initialPlayers: [
    { id: "seed-zach", name: "Zach", paid: false, points: [0, 0, 0] },
    { id: "seed-abdul", name: "Abdul", paid: false, points: [0, 0, 0] },
  ],
};
