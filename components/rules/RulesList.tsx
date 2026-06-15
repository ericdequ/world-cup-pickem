import { tournament } from "@/lib/config";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "./SectionTitle";

export function RulesList() {
  return (
    <Card className="animate-fade-up rounded-[14px] p-5" style={{ animationDelay: "0.1s" }}>
      <SectionTitle>Rules</SectionTitle>
      {tournament.rules.map((rule, i, arr) => (
        <div
          key={rule}
          className={cn(
            "flex items-start gap-3 py-2.5",
            i < arr.length - 1 && "border-b border-pitch-border",
          )}
        >
          <span className="mt-px inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-gold/10 text-[11px] font-bold text-gold">
            {i + 1}
          </span>
          <span className="text-[13px] leading-relaxed text-ink">{rule}</span>
        </div>
      ))}
    </Card>
  );
}
