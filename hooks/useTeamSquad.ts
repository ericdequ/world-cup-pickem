"use client";

import type { PlayerProfile } from "@/lib/types";
import { dataProvider } from "@/lib/data";
import { useAsyncData } from "./useAsyncData";

const NONE: PlayerProfile[] = [];

/** Roster for a team by name. Empty for placeholder (TBD) slots. */
export function useTeamSquad(teamName: string | null) {
  return useAsyncData<PlayerProfile[]>(
    () => (teamName ? dataProvider.getTeamSquad(teamName) : Promise.resolve(NONE)),
    [teamName],
    NONE,
  );
}
