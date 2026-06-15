"use client";

import { useState } from "react";
import type { LineupPlayer, Match } from "@/lib/types";
import { useMatches, useLineup } from "@/hooks/useMatches";
import { cn } from "@/lib/cn";

function MatchPicker({
  matches,
  selectedId,
  onSelect,
}: {
  matches: Match[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto pb-2">
      {matches.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect(m.id)}
          className={cn(
            "shrink-0 rounded-lg border px-3 py-2 text-[13px] font-semibold transition-colors",
            selectedId === m.id
              ? "border-gold bg-gold/10 text-gold-light"
              : "border-pitch-border bg-pitch-card text-muted hover:text-cream",
          )}
        >
          {m.home.code} v {m.away.code}
        </button>
      ))}
    </div>
  );
}

function PlayerList({ title, players }: { title: string; players: LineupPlayer[] }) {
  return (
    <div className="flex-1">
      <h3 className="mb-2 text-[12px] font-bold uppercase tracking-[0.12em] text-gold">{title}</h3>
      <ul className="flex flex-col gap-1.5">
        {players.map((p) => (
          <li key={p.id} className="flex items-center gap-2.5 text-[13px]">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-pitch text-[11px] font-bold text-muted">
              {p.number ?? "–"}
            </span>
            <span className="text-cream">{p.name}</span>
            {p.position && <span className="text-[11px] text-muted">{p.position}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LineupDisplay() {
  const { data: matches, loading } = useMatches();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const activeId = selectedId ?? matches[0]?.id ?? null;
  const { data: lineup, loading: lineupLoading } = useLineup(activeId);
  const active = matches.find((m) => m.id === activeId);

  if (loading) return <p className="py-12 text-center text-sm text-muted">Loading…</p>;

  return (
    <div className="flex flex-col gap-4">
      <MatchPicker matches={matches} selectedId={activeId} onSelect={setSelectedId} />

      {active && (
        <div className="text-center text-[13px] text-muted">
          {active.home.name} vs {active.away.name}
          {lineup?.formation ? ` · ${lineup.formation}` : ""}
        </div>
      )}

      {lineupLoading ? (
        <p className="py-8 text-center text-sm text-muted">Loading lineup…</p>
      ) : lineup ? (
        <div className="flex gap-5 rounded-xl border border-pitch-border bg-pitch-card p-4">
          <PlayerList title={active?.home.code ?? "Home"} players={lineup.home} />
          <PlayerList title={active?.away.code ?? "Away"} players={lineup.away} />
        </div>
      ) : (
        <div className="rounded-xl border border-pitch-border bg-pitch-card p-6 text-center text-[13px] text-muted">
          📋 Lineups are announced about <span className="text-cream">1 hour before kickoff</span>.
          Check back closer to the match.
        </div>
      )}
    </div>
  );
}
