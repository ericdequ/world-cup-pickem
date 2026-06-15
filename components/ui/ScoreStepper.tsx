"use client";

import { cn } from "@/lib/cn";

/** Big tap-friendly − N + control. The primary way to enter a predicted score. */
export function ScoreStepper({
  value,
  onChange,
  disabled = false,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  const btn =
    "flex h-9 w-9 items-center justify-center rounded-lg border border-pitch-border bg-pitch text-lg font-bold text-cream transition-colors enabled:hover:border-gold enabled:hover:text-gold disabled:opacity-40";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="decrease"
        disabled={disabled || value <= 0}
        onClick={() => onChange(value - 1)}
        className={cn(btn, "disabled:cursor-not-allowed")}
      >
        −
      </button>
      <span className="w-7 text-center text-2xl font-extrabold tabular-nums text-gold-light">
        {value}
      </span>
      <button
        type="button"
        aria-label="increase"
        disabled={disabled}
        onClick={() => onChange(value + 1)}
        className={cn(btn, "disabled:cursor-not-allowed")}
      >
        +
      </button>
    </div>
  );
}
