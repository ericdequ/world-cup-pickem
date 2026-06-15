"use client";

import { useState } from "react";
import type { PlayerProfile } from "@/lib/types";
import { usePlayerSearch } from "@/hooks/usePlayerSearch";
import { TextInput } from "@/components/ui/Input";

function PlayerCard({ player }: { player: PlayerProfile }) {
  return (
    <div className="flex gap-3 rounded-xl border border-pitch-border bg-pitch-card p-3">
      {player.thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={player.thumb}
          alt={player.name}
          className="h-16 w-16 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-pitch text-2xl">
          👤
        </div>
      )}
      <div className="min-w-0">
        <div className="text-[15px] font-semibold">{player.name}</div>
        <div className="text-[12px] text-muted">
          {[player.position, player.team, player.nationality].filter(Boolean).join(" · ")}
        </div>
        {player.description && (
          <p className="mt-1 line-clamp-3 text-[12px] leading-relaxed text-ink">
            {player.description}
          </p>
        )}
      </div>
    </div>
  );
}

export function PlayerResearch() {
  const [query, setQuery] = useState("");
  const { results, loading } = usePlayerSearch(query);

  return (
    <div className="flex flex-col gap-4">
      <TextInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search any player — e.g. Vinicius, Mbappé, Pulisic…"
        autoFocus
      />

      {loading && <p className="text-center text-sm text-muted">Searching…</p>}

      {!loading && query.trim() && results.length === 0 && (
        <p className="text-center text-sm text-muted">No players found for “{query}”.</p>
      )}

      {!loading && !query.trim() && (
        <p className="py-8 text-center text-[13px] text-muted">
          🔎 Look up any player to scout form, position, and background before you predict.
        </p>
      )}

      <div className="flex flex-col gap-2.5">
        {results.map((p) => (
          <PlayerCard key={p.id} player={p} />
        ))}
      </div>
    </div>
  );
}
