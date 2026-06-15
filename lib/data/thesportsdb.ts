import type { Lineup, Match, MatchStatus, PlayerProfile, Stage } from "@/lib/types";
import type { MatchDataProvider } from "./provider";
import { FALLBACK_MATCHES } from "./fallbackMatches";

/**
 * TheSportsDB provider — free, no API key required (public test key "3").
 * Docs: https://www.thesportsdb.com/free_sports_api
 *
 * Every call degrades gracefully: network/rate-limit failures fall back to the
 * built-in sample data (matches) or an empty result (lineups/players) so the UI
 * never breaks.
 */
const BASE = "https://www.thesportsdb.com/api/v1/json/3";
const WORLD_CUP_LEAGUE_ID = "4429"; // FIFA World Cup
const SEASON = "2026";

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

const codeFor = (name: string): string =>
  name
    .replace(/[^a-zA-Z ]/g, "")
    .trim()
    .slice(0, 3)
    .toUpperCase();

function stageFromRound(round?: string): Stage {
  switch ((round ?? "").toLowerCase()) {
    case "final":
      return "final";
    case "semi-finals":
    case "semi-final":
      return "semi-final";
    case "quarter-finals":
    case "quarter-final":
      return "quarter-final";
    case "round of 16":
      return "round-of-16";
    case "round of 32":
      return "round-of-32";
    default:
      return "group";
  }
}

function statusFrom(strStatus?: string, kickoff?: string): MatchStatus {
  const s = (strStatus ?? "").toLowerCase();
  if (["match finished", "ft", "aet", "pen"].some((t) => s.includes(t))) return "finished";
  if (["1h", "2h", "ht", "live", "in play"].some((t) => s.includes(t))) return "live";
  if (kickoff && Date.now() > new Date(kickoff).getTime() + 2 * 60 * 60 * 1000) {
    return "finished";
  }
  return "scheduled";
}

interface SdbEvent {
  idEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  dateEvent: string | null;
  strTime: string | null;
  strTimestamp: string | null;
  strVenue: string | null;
  strStatus: string | null;
  intRound: string | null;
  strLeague: string | null;
}

function toMatch(e: SdbEvent): Match {
  const kickoff =
    e.strTimestamp ??
    (e.dateEvent ? `${e.dateEvent}T${e.strTime ?? "00:00:00"}Z` : new Date().toISOString());
  const status = statusFrom(e.strStatus ?? undefined, kickoff);
  const hasScore = e.intHomeScore !== null && e.intAwayScore !== null;

  return {
    id: e.idEvent,
    stage: stageFromRound(e.intRound ?? undefined),
    home: { id: `h-${e.idEvent}`, name: e.strHomeTeam, code: codeFor(e.strHomeTeam) },
    away: { id: `a-${e.idEvent}`, name: e.strAwayTeam, code: codeFor(e.strAwayTeam) },
    kickoff,
    venue: e.strVenue ?? undefined,
    status,
    result: hasScore
      ? { home: Number(e.intHomeScore), away: Number(e.intAwayScore) }
      : undefined,
  };
}

interface SdbPlayer {
  idPlayer: string;
  strPlayer: string;
  strTeam: string | null;
  strNationality: string | null;
  strPosition: string | null;
  strThumb: string | null;
  strDescriptionEN: string | null;
}

export const theSportsDbProvider: MatchDataProvider = {
  async getMatches() {
    const data = await getJson<{ events: SdbEvent[] | null }>(
      `${BASE}/eventsseason.php?id=${WORLD_CUP_LEAGUE_ID}&s=${SEASON}`,
    );
    const events = data?.events ?? [];
    if (events.length === 0) return FALLBACK_MATCHES;
    return events
      .map(toMatch)
      .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
  },

  async getLineup(matchId) {
    const data = await getJson<{ lineup: Array<Record<string, string>> | null }>(
      `${BASE}/lookuplineup.php?id=${matchId}`,
    );
    const rows = data?.lineup ?? [];
    if (rows.length === 0) return null;

    const home: Lineup["home"] = [];
    const away: Lineup["away"] = [];
    for (const r of rows) {
      const player = {
        id: r.idPlayer ?? r.strPlayer,
        name: r.strPlayer,
        position: r.strPosition || undefined,
        number: r.intSquadNumber ? Number(r.intSquadNumber) : undefined,
      };
      (r.strHome === "yes" ? home : away).push(player);
    }
    return { matchId, home, away };
  },

  async searchPlayers(query) {
    const q = query.trim();
    if (!q) return [];
    const data = await getJson<{ player: SdbPlayer[] | null }>(
      `${BASE}/searchplayers.php?p=${encodeURIComponent(q)}`,
    );
    return (data?.player ?? []).map(toPlayerProfile);
  },

  async getTeamSquad(teamName) {
    const t = teamName.trim();
    if (!t) return [];
    const data = await getJson<{ player: SdbPlayer[] | null }>(
      `${BASE}/searchplayers.php?t=${encodeURIComponent(t)}`,
    );
    return (data?.player ?? []).map(toPlayerProfile);
  },
};

function toPlayerProfile(p: SdbPlayer): PlayerProfile {
  return {
    id: p.idPlayer,
    name: p.strPlayer,
    team: p.strTeam ?? undefined,
    nationality: p.strNationality ?? undefined,
    position: p.strPosition ?? undefined,
    thumb: p.strThumb ?? undefined,
    description: p.strDescriptionEN ?? undefined,
  };
}
