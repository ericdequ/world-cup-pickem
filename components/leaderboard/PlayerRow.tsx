"use client";

import type { Player } from "@/lib/types";
import { playerTotal } from "@/lib/scoring";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { RankBadge } from "./RankBadge";
import { rowColumns } from "./gridColumns";

export function PlayerRow({
  player,
  rank,
  onClick,
}: {
  player: Player;
  rank: number;
  onClick: () => void;
}) {
  const leader = rank === 0;

  return (
    <button
      onClick={onClick}
      style={{
        gridTemplateColumns: rowColumns(player.points.length),
        animationDelay: `${rank * 0.08}s`,
      }}
      className={cn(
        "grid animate-fade-up cursor-pointer items-center gap-x-3 rounded-[10px] border px-5 py-3.5 text-left transition-transform hover:translate-x-[3px]",
        leader
          ? "border-gold/35 bg-[linear-gradient(90deg,rgba(201,168,76,0.1),transparent)]"
          : "border-pitch-border bg-pitch-card",
      )}
    >
      <RankBadge rank={rank} />

      <span className="flex items-center gap-2.5">
        <span className="text-[15px] font-semibold">{player.name}</span>
        <Badge tone={player.paid ? "paid" : "unpaid"}>{player.paid ? "PAID" : "UNPAID"}</Badge>
      </span>

      {player.points.map((pts, i) => (
        <span
          key={i}
          className={cn(
            "text-center text-sm font-semibold",
            pts > 0 ? "text-gold-light" : "text-muted",
          )}
        >
          {pts}
        </span>
      ))}

      <span
        className={cn(
          "text-center text-base font-bold",
          leader ? "text-gold-light" : "text-cream",
        )}
      >
        {playerTotal(player)}
      </span>
    </button>
  );
}
