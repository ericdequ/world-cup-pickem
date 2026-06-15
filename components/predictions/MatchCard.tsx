"use client";

import type { Match, Prediction, Score, Team } from "@/lib/types";
import { isLocked, scorePrediction } from "@/lib/predictions";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { ScoreStepper } from "@/components/ui/ScoreStepper";

const time = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });

function StatusPill({ match, locked }: { match: Match; locked: boolean }) {
  if (match.status === "live") return <Badge tone="unpaid">🔴 LIVE</Badge>;
  if (match.status === "finished")
    return (
      <Badge tone="gold">
        FT {match.result ? `${match.result.home}–${match.result.away}` : ""}
      </Badge>
    );
  return (
    <span className={cn("text-[11px] font-semibold", locked ? "text-red-400" : "text-muted")}>
      {locked ? "🔒 Locked" : `Locks ${time(match.kickoff)}`}
    </span>
  );
}

function TeamRow({
  team,
  value,
  onChange,
  disabled,
}: {
  team: Team;
  value: number;
  onChange: (v: number) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-7 w-9 items-center justify-center rounded bg-pitch text-[11px] font-bold text-gold-light">
          {team.code}
        </span>
        <span className="text-[15px] font-semibold">{team.name}</span>
      </div>
      <ScoreStepper value={value} onChange={(v) => onChange(Math.max(0, v))} disabled={disabled} />
    </div>
  );
}

export function MatchCard({
  match,
  prediction,
  onChange,
}: {
  match: Match;
  prediction?: Prediction;
  onChange: (score: Score) => void;
}) {
  const locked = isLocked(match);
  const score: Score = prediction?.score ?? { home: 0, away: 0 };
  const set = (side: "home" | "away", v: number) => onChange({ ...score, [side]: v });
  const earned = prediction && match.result ? scorePrediction(prediction, match) : null;

  return (
    <div
      className={cn(
        "rounded-xl border bg-pitch-card p-4",
        locked ? "border-pitch-border opacity-95" : "border-pitch-border",
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
          {match.group ? `Group ${match.group}` : ""}
          {match.venue ? <span className="font-normal"> · {match.venue}</span> : null}
        </span>
        <StatusPill match={match} locked={locked} />
      </div>

      <div className="flex flex-col gap-3">
        <TeamRow team={match.home} value={score.home} onChange={(v) => set("home", v)} disabled={locked} />
        <TeamRow team={match.away} value={score.away} onChange={(v) => set("away", v)} disabled={locked} />
      </div>

      {earned !== null && (
        <div className="mt-3 border-t border-pitch-border pt-2.5 text-center text-[13px]">
          <span className={cn("font-bold", earned > 0 ? "text-gold-light" : "text-muted")}>
            {earned > 0 ? `✓ +${earned} pts` : "No points this match"}
          </span>
          <span className="text-muted"> · your pick {score.home}–{score.away}</span>
        </div>
      )}

      {!locked && !prediction && (
        <p className="mt-3 text-center text-[11px] text-muted">
          Set a score to save your prediction
        </p>
      )}
    </div>
  );
}
