import { tournament } from "@/lib/config";

export function EntryFeeWarning() {
  return (
    <div
      className="mt-4 animate-fade-up rounded-xl border border-red-500/20 bg-red-500/[0.08] p-4"
      style={{ animationDelay: "0.25s" }}
    >
      <div className="mb-1 text-[13px] font-semibold text-red-400">
        ⚠️ {tournament.entryDeadlineNote}
      </div>
      <div className="text-xs text-muted">
        Accepted: {tournament.paymentMethods.join(" · ")}
      </div>
    </div>
  );
}
