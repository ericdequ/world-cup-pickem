"use client";

import { useState } from "react";
import type { TabKey } from "@/lib/types";
import { tournament } from "@/lib/config";
import { calculatePot } from "@/lib/scoring";
import { usePlayers } from "@/hooks/usePlayers";
import { Hero } from "@/components/layout/Hero";
import { TabBar } from "@/components/layout/TabBar";
import { Leaderboard } from "@/components/leaderboard/Leaderboard";
import { PlayerEditModal } from "@/components/leaderboard/PlayerEditModal";
import { Rules } from "@/components/rules/Rules";

export default function Home() {
  const { players, addPlayer, updatePlayer, removePlayer } = usePlayers();
  const [tab, setTab] = useState<TabKey>("board");
  const [editingId, setEditingId] = useState<string | null>(null);

  const editing = players.find((p) => p.id === editingId) ?? null;
  const pot = calculatePot(players, tournament.entryFee);

  return (
    <main className="min-h-screen bg-pitch">
      <Hero pot={pot} />
      <TabBar active={tab} onChange={setTab} />

      <div className="mx-auto max-w-[760px] px-4 pb-20 pt-6">
        {tab === "board" ? (
          <Leaderboard players={players} onSelect={setEditingId} onAdd={addPlayer} />
        ) : (
          <Rules />
        )}
      </div>

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
    </main>
  );
}
