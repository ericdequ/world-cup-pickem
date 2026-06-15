"use client";

import type { TabKey } from "@/lib/types";
import { cn } from "@/lib/cn";

const TABS: { key: TabKey; label: string }[] = [
  { key: "board", label: "🏆 Leaderboard" },
  { key: "rules", label: "📋 Rules" },
];

export function TabBar({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}) {
  return (
    <nav className="mx-auto flex max-w-[760px] border-b border-pitch-border bg-pitch-mid px-5">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "cursor-pointer border-b-2 px-5 py-3.5 text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors",
            active === tab.key
              ? "border-gold text-gold-light"
              : "border-transparent text-muted hover:text-cream",
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
