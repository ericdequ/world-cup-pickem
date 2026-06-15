"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/Input";

export function AddPlayer({ onAdd }: { onAdd: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const reset = () => {
    setName("");
    setOpen(false);
  };

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    reset();
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 w-full cursor-pointer rounded-[10px] border border-dashed border-pitch-border py-3 text-[13px] font-semibold text-muted transition-colors hover:border-gold hover:text-gold"
      >
        + Add Player
      </button>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-2 rounded-[10px] border border-pitch-border bg-pitch-card px-4 py-3">
      <TextInput
        autoFocus
        placeholder="Player name…"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") reset();
        }}
      />
      <Button onClick={submit} className="px-4 py-2 text-[13px]">
        Add
      </Button>
      <Button variant="ghost" onClick={reset} className="px-3 py-2 text-[13px]">
        ✕
      </Button>
    </div>
  );
}
