import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Use a subtle gold border instead of the default. */
  accent?: boolean;
}

export function Card({ accent = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-pitch-card",
        accent ? "border-gold/20" : "border-pitch-border",
        className,
      )}
      {...props}
    />
  );
}
