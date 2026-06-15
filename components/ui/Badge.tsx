import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "paid" | "unpaid" | "gold";

const tones: Record<Tone, string> = {
  paid: "bg-field/35 text-green-400",
  unpaid: "bg-red-500/20 text-red-400",
  gold: "bg-gold/10 text-gold border border-gold/25",
};

export function Badge({
  tone,
  children,
  className,
}: {
  tone: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
