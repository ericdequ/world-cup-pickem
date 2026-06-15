import { tournament } from "@/lib/config";
import { cn } from "@/lib/cn";

export function FormatExamples() {
  const { predictionExamples } = tournament;
  return (
    <div
      className="mt-4 animate-fade-up rounded-xl border border-pitch-border bg-pitch-mid p-4"
      style={{ animationDelay: "0.2s" }}
    >
      <div className="mb-2.5 text-[11px] font-bold tracking-[0.12em] text-muted">
        PREDICTION FORMAT EXAMPLES
      </div>
      {predictionExamples.map((example, i) => (
        <div
          key={example}
          className={cn(
            "rounded-md bg-pitch px-3 py-2 font-mono text-sm text-gold-light",
            i < predictionExamples.length - 1 && "mb-2",
          )}
        >
          {example}
        </div>
      ))}
    </div>
  );
}
