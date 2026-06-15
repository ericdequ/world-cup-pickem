"use client";

import { cn } from "@/lib/cn";

export type AppSection = "predict" | "lineups" | "players" | "pool" | "profile";

const ITEMS: { key: AppSection; label: string; icon: string }[] = [
  { key: "predict", label: "Predict", icon: "🎯" },
  { key: "lineups", label: "Lineups", icon: "📋" },
  { key: "players", label: "Players", icon: "🔎" },
  { key: "pool", label: "Pool", icon: "🏆" },
  { key: "profile", label: "Profile", icon: "👤" },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: AppSection;
  onChange: (section: AppSection) => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-pitch-border bg-pitch-mid/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-[760px]">
        {ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors",
              active === item.key ? "text-gold-light" : "text-muted hover:text-cream",
            )}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
