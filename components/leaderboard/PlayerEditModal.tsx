"use client";

import { useState, type ReactNode } from "react";
import type { Player } from "@/lib/types";
import { tournament } from "@/lib/config";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { TextInput, NumberInput } from "@/components/ui/Input";

const Label = ({ children }: { children: ReactNode }) => (
  <span className="mb-1.5 block text-xs text-muted">{children}</span>
);

export function PlayerEditModal({
  player,
  onSave,
  onDelete,
  onClose,
}: {
  player: Player;
  onSave: (player: Player) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Player>(() => structuredClone(player));

  const setPoint = (index: number, value: number) => {
    const points = [...draft.points];
    points[index] = Math.max(0, Number.isFinite(value) ? value : 0);
    setDraft({ ...draft, points });
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="mb-5 text-lg font-bold">Edit — {player.name}</h3>

      <Label>Name</Label>
      <TextInput
        value={draft.name}
        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        className="mb-5"
      />

      <Label>Points per round</Label>
      <div
        className="mb-5 grid gap-2.5"
        style={{ gridTemplateColumns: `repeat(${tournament.rounds.length}, 1fr)` }}
      >
        {tournament.rounds.map((round, i) => (
          <div key={round}>
            <div className="mb-1 text-[11px] text-muted">{round}</div>
            <NumberInput
              value={draft.points[i] ?? 0}
              onChange={(e) => setPoint(i, parseInt(e.target.value, 10))}
            />
          </div>
        ))}
      </div>

      <Switch
        checked={draft.paid}
        onChange={(paid) => setDraft({ ...draft, paid })}
        label={draft.paid ? "Entry fee paid ✓" : "Entry fee unpaid"}
        className="mb-6"
      />

      <div className="flex gap-2.5">
        <Button onClick={() => onSave(draft)} className="flex-1">
          Save
        </Button>
        <Button variant="danger" onClick={onDelete} className="px-4">
          Remove
        </Button>
      </div>
    </Modal>
  );
}
