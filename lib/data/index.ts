import { theSportsDbProvider } from "./thesportsdb";
import type { MatchDataProvider } from "./provider";

/**
 * The active data source. Swap this line to change providers app-wide
 * (e.g. API-Football or the self-hosted worldcup2026 API) — nothing else changes.
 */
export const dataProvider: MatchDataProvider = theSportsDbProvider;

export type { MatchDataProvider } from "./provider";
