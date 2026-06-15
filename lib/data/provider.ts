import type { Lineup, Match, PlayerProfile } from "@/lib/types";

/**
 * The data source contract. Components and hooks depend on this interface only,
 * so swapping TheSportsDB for API-Football (or the self-hosted worldcup2026 API)
 * later is a one-file change with zero component edits.
 */
export interface MatchDataProvider {
  /** All World Cup matches across every stage. */
  getMatches(): Promise<Match[]>;
  /** Confirmed lineups for a match (empty until announced ~1h before kickoff). */
  getLineup(matchId: string): Promise<Lineup | null>;
  /** Free-text player search for the research view. */
  searchPlayers(query: string): Promise<PlayerProfile[]>;
  /** Squad/roster for a team by name (for the team selection modal). */
  getTeamSquad(teamName: string): Promise<PlayerProfile[]>;
}
