"use client";

import type { Lineup, Match } from "@/lib/types";
import { dataProvider } from "@/lib/data";
import { useAsyncData } from "./useAsyncData";

const NO_MATCHES: Match[] = [];

export function useMatches() {
  return useAsyncData<Match[]>(() => dataProvider.getMatches(), [], NO_MATCHES);
}

export function useLineup(matchId: string | null) {
  return useAsyncData<Lineup | null>(
    () => (matchId ? dataProvider.getLineup(matchId) : Promise.resolve(null)),
    [matchId],
    null,
  );
}
