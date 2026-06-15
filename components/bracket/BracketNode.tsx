"use client";

import type { Match, Prediction, Team } from "@/lib/types";
import { cn } from "@/lib/cn";

function side(team: Team, score?: number, winner?: boolean) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className={cn("truncate text-[12px]", winner ? "font-bold text-cream" : "text-muted")}>
        {team.code}
      </span>
      {score !== undefined && (
        <span className={cn("text-[12px] tabular-nums", winner ? "text-gold-light" : "text-muted")}>
          {score}
        </span>
      )}
    </div>
  );
}

/** One match in the bracket tree. Shows result if finished, else the user's pick. */
export function BracketNode({
  match,
  prediction,
  withConnector,
  onClick,
}: {
  match: Match;
  prediction?: Prediction;
  withConnector?: boolean;
  onClick: () => void;
}) {
  const shown = match.result ?? prediction?.score;
  const homeWin = shown ? shown.home > shown.away : false;
  const awayWin = shown ? shown.away > shown.home : false;

  return (
    <div className="relative">
      {withConnector && (
        <span className="absolute top-1/2 -left-2 h-px w-2 bg-pitch-border" aria-hidden />
      )}
      <button
        onClick={onClick}
        className="flex w-full flex-col gap-1 rounded-lg border border-pitch-border bg-pitch-card px-2.5 py-2 text-left transition-colors hover:border-gold/50"
      >
        {side(match.home, shown?.home, homeWin)}
        <div className="h-px bg-pitch-border" />
        {side(match.away, shown?.away, awayWin)}
      </button>
    </div>
  );
}
