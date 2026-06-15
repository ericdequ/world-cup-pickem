"use client";

import type { Player } from "@/lib/types";
import { tournament } from "@/lib/config";
import { sortByTotal } from "@/lib/scoring";
import { PlayerRow } from "./PlayerRow";
import { AddPlayer } from "./AddPlayer";
import { PrizeBreakdown } from "./PrizeBreakdown";
import { rowColumns } from "./gridColumns";

export function Leaderboard({
  players,
  onSelect,
  onAdd,
}: {
  players: Player[];
  onSelect: (id: string) => void;
  onAdd: (name: string) => void;
}) {
  const ranked = sortByTotal(players);
  const columns = rowColumns(tournament.rounds.length);

  return (
    <>
      <div
        className="grid gap-x-3 px-5 pb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-muted"
        style={{ gridTemplateColumns: columns }}
      >
        <div />
        <div>Player</div>
        {tournament.rounds.map((_, i) => (
          <div key={i} className="text-center">
            R{i + 1}
          </div>
        ))}
        <div className="text-center">Total</div>
      </div>

      <div className="flex flex-col gap-2">
        {ranked.map((player, rank) => (
          <PlayerRow
            key={player.id}
            player={player}
            rank={rank}
            onClick={() => onSelect(player.id)}
          />
        ))}
      </div>

      <AddPlayer onAdd={onAdd} />
      <PrizeBreakdown />
    </>
  );
}
