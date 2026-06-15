import type { Match, Team } from "@/lib/types";

/**
 * Built-in sample schedule. Used when the live API has no data yet (or is rate
 * limited) so the app is always usable for development and demos. Real fixtures
 * from {@link MatchDataProvider.getMatches} replace these at runtime when available.
 */
const team = (id: string, name: string, code: string, group?: string): Team => ({
  id,
  name,
  code,
  group,
});

const BRA = team("t-bra", "Brazil", "BRA", "A");
const ESP = team("t-esp", "Spain", "ESP", "A");
const USA = team("t-usa", "USA", "USA", "B");
const MEX = team("t-mex", "Mexico", "MEX", "B");
const FRA = team("t-fra", "France", "FRA", "C");
const ENG = team("t-eng", "England", "ENG", "C");
const ARG = team("t-arg", "Argentina", "ARG", "D");
const GER = team("t-ger", "Germany", "GER", "D");

export const FALLBACK_MATCHES: Match[] = [
  {
    id: "m-usa-mex",
    stage: "group",
    group: "B",
    home: USA,
    away: MEX,
    kickoff: "2026-06-13T20:00:00Z",
    venue: "SoFi Stadium, Los Angeles",
    status: "finished",
    result: { home: 2, away: 1 },
  },
  {
    id: "m-bra-esp",
    stage: "group",
    group: "A",
    home: BRA,
    away: ESP,
    kickoff: "2026-06-14T18:00:00Z",
    venue: "MetLife Stadium, New Jersey",
    status: "finished",
    result: { home: 3, away: 1 },
  },
  {
    id: "m-fra-eng",
    stage: "group",
    group: "C",
    home: FRA,
    away: ENG,
    kickoff: "2026-06-15T16:00:00Z",
    venue: "AT&T Stadium, Dallas",
    status: "live",
  },
  {
    id: "m-arg-ger",
    stage: "group",
    group: "D",
    home: ARG,
    away: GER,
    kickoff: "2026-06-15T22:00:00Z",
    venue: "Estadio Azteca, Mexico City",
    status: "scheduled",
  },
  {
    id: "m-esp-mex",
    stage: "group",
    group: "A",
    home: ESP,
    away: MEX,
    kickoff: "2026-06-16T19:00:00Z",
    venue: "BC Place, Vancouver",
    status: "scheduled",
  },
  {
    id: "m-bra-usa",
    stage: "round-of-16",
    home: BRA,
    away: USA,
    kickoff: "2026-06-17T20:00:00Z",
    venue: "Hard Rock Stadium, Miami",
    status: "scheduled",
  },
];
