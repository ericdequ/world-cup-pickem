"use client";

import { useCallback } from "react";
import type { Player } from "@/lib/types";
import { tournament } from "@/lib/config";
import { useLocalStorage } from "./useLocalStorage";

const STORAGE_KEY = "wc-pickem:players";

const newId = (): string =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `p_${Math.random().toString(36).slice(2, 10)}`;

const emptyPoints = (): number[] => tournament.rounds.map(() => 0);

/** CRUD over the persisted player list. The single source of truth for the board. */
export function usePlayers() {
  const [players, setPlayers] = useLocalStorage<Player[]>(
    STORAGE_KEY,
    tournament.initialPlayers,
  );

  const addPlayer = useCallback(
    (name: string) =>
      setPlayers((prev) => [
        ...prev,
        { id: newId(), name, paid: false, points: emptyPoints() },
      ]),
    [setPlayers],
  );

  const updatePlayer = useCallback(
    (player: Player) =>
      setPlayers((prev) => prev.map((p) => (p.id === player.id ? player : p))),
    [setPlayers],
  );

  const removePlayer = useCallback(
    (id: string) => setPlayers((prev) => prev.filter((p) => p.id !== id)),
    [setPlayers],
  );

  return { players, addPlayer, updatePlayer, removePlayer };
}
