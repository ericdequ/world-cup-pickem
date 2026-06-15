"use client";

import { useLocalStorage } from "./useLocalStorage";

/** The user's favorite team code (e.g. "BRA"), used to target game reminders. */
export function useFavoriteTeam() {
  return useLocalStorage<string | null>("wc-pickem:favorite-team", null);
}
