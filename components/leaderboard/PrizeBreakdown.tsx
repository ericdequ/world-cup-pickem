import { tournament } from "@/lib/config";
import { cn } from "@/lib/cn";

export function PrizeBreakdown() {
  const tiers = [
    {
      value: `${Math.round(tournament.roundWinnerShare * 100)}%`,
      label: "Each Round Winner",
      tone: "text-gold",
    },
    {
      value: `${Math.round(tournament.championShare * 100)}%`,
      label: "Overall Champion",
      tone: "text-gold-light",
    },
    { value: `$${tournament.entryFee}`, label: "Entry Fee", tone: "text-muted" },
  ];

  return (
    <div className="mt-8 grid grid-cols-3 gap-2.5">
      {tiers.map((tier, i) => (
        <div
          key={tier.label}
          style={{ animationDelay: `${i * 0.1 + 0.2}s` }}
          className="animate-fade-up rounded-xl border border-pitch-border bg-pitch-card px-3 py-4 text-center"
        >
          <div className={cn("mb-1 text-2xl font-extrabold", tier.tone)}>{tier.value}</div>
          <div className="text-[11px] font-semibold text-muted">{tier.label}</div>
        </div>
      ))}
    </div>
  );
}
