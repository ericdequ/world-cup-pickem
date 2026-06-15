import type { Match } from "@/lib/types";
import { supabase } from "@/lib/supabase/client";
import type { MatchDataProvider } from "./provider";

/**
 * Wraps a provider so fixtures are read from the Supabase `fixtures_cache` table
 * (populated server-side by the cache-fixtures Edge Function) when available,
 * falling back to a live API call otherwise.
 *
 * This is what preserves a rate-limited free tier: once the cache is populated,
 * clients stop hitting the sports API for fixtures entirely. Lineups and player
 * search pass straight through (lower volume, often real-time).
 */
export function cachedProvider(inner: MatchDataProvider): MatchDataProvider {
  return {
    async getMatches() {
      if (supabase) {
        const { data } = await supabase
          .from("fixtures_cache")
          .select("data")
          .eq("id", "wc2026")
          .maybeSingle();
        const cached = data?.data as Match[] | undefined;
        if (cached && cached.length > 0) return cached;
      }
      return inner.getMatches();
    },
    getLineup: inner.getLineup,
    searchPlayers: inner.searchPlayers,
  };
}
