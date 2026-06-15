import { theSportsDbProvider } from "./thesportsdb";
import { cachedProvider } from "./cachedProvider";
import type { MatchDataProvider } from "./provider";

/**
 * The active data source. Swap the inner provider to change vendors app-wide
 * (e.g. API-Football or the self-hosted worldcup2026 API) — nothing else changes.
 *
 * Wrapped in `cachedProvider` so fixtures come from the Supabase server-side
 * cache when available (protects rate-limited free tiers), falling back to live.
 */
export const dataProvider: MatchDataProvider = cachedProvider(theSportsDbProvider);

export type { MatchDataProvider } from "./provider";
