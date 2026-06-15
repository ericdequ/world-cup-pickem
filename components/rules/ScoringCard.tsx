import { tournament } from "@/lib/config";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "./SectionTitle";

export function ScoringCard() {
  return (
    <Card accent className="mb-4 animate-fade-up rounded-[14px] p-5">
      <SectionTitle>Scoring System</SectionTitle>
      {tournament.scoring.map((rule, i, arr) => (
        <div
          key={rule.label}
          className={cn(
            "flex items-center justify-between py-2.5",
            i < arr.length - 1 && "border-b border-pitch-border",
          )}
        >
          <span className="flex items-center gap-2.5">
            <span className="text-lg">{rule.icon}</span>
            <span className="text-[13px] text-cream">{rule.label}</span>
          </span>
          <span className="text-xl font-extrabold text-gold-light">+{rule.points}</span>
        </div>
      ))}
    </Card>
  );
}
