"use client";

import { useState } from "react";
import { usePlayers } from "@/hooks/usePlayers";
import { Leaderboard } from "@/components/leaderboard/Leaderboard";
import { PlayerEditModal } from "@/components/leaderboard/PlayerEditModal";
import { Rules } from "@/components/rules/Rules";
import { PotPanel } from "@/components/tournament/PotPanel";
import { cn } from "@/lib/cn";

type PoolTab = "friends" | "global" | "rules";

const TABS: { key: PoolTab; label: string }[] = [
  { key: "friends", label: "Friends Pool" },
  { key: "global", label: "Global Pool" },
  { key: "rules", label: "Rules" },
];

export function PoolPanel() {
  const { players, addPlayer, updatePlayer, removePlayer } = usePlayers();
  const [tab, setTab] = useState<PoolTab>("friends");
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = players.find((p) => p.id === editingId) ?? null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex-1 rounded-lg border px-3 py-2 text-[13px] font-semibold transition-colors",
              tab === t.key
                ? "border-gold bg-gold/10 text-gold-light"
                : "border-pitch-border bg-pitch-card text-muted hover:text-cream",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "friends" && (
        <Leaderboard players={players} onSelect={setEditingId} onAdd={addPlayer} />
      )}
      {tab === "global" && <PotPanel />}
      {tab === "rules" && <Rules />}

      {editing && (
        <PlayerEditModal
          player={editing}
          onSave={(updated) => {
            updatePlayer(updated);
            setEditingId(null);
          }}
          onDelete={() => {
            removePlayer(editing.id);
            setEditingId(null);
          }}
          onClose={() => setEditingId(null)}
        />
      )}
    </div>
  );
}
