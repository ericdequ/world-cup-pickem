"use client";

import { useEffect, useState } from "react";
import type { PlayerProfile } from "@/lib/types";
import { dataProvider } from "@/lib/data";

/** Debounced player search for the research view. */
export function usePlayerSearch(query: string, delayMs = 350) {
  const [results, setResults] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const id = setTimeout(async () => {
      const q = query.trim();
      if (!q) {
        if (active) {
          setResults([]);
          setLoading(false);
        }
        return;
      }
      if (active) setLoading(true);
      const found = await dataProvider.searchPlayers(q);
      if (active) {
        setResults(found);
        setLoading(false);
      }
    }, delayMs);

    return () => {
      active = false;
      clearTimeout(id);
    };
  }, [query, delayMs]);

  return { results, loading };
}
