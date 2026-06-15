"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Switch({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn("flex cursor-pointer items-center gap-3", className)}
    >
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-field" : "bg-pitch-border",
        )}
      >
        <span
          className={cn(
            "absolute top-[3px] h-[18px] w-[18px] rounded-full bg-cream transition-[left]",
            checked ? "left-[23px]" : "left-[3px]",
          )}
        />
      </span>
      {label && (
        <span className={cn("text-sm", checked ? "text-green-400" : "text-muted")}>{label}</span>
      )}
    </button>
  );
}
