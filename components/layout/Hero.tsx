import { tournament } from "@/lib/config";

/** Tournament banner. Shows the live pot once at least one entry is paid. */
export function Hero({ pot }: { pot: number }) {
  const { edition, tagline, roundWinnerShare, championShare } = tournament;

  return (
    <header className="relative overflow-hidden border-b border-pitch-border bg-[linear-gradient(180deg,#0f2040_0%,#0a1628_100%)] px-5 pt-12 pb-9 text-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 60px)",
        }}
      />

      <span className="mb-4 inline-block rounded-full border border-gold/25 bg-gold/10 px-3.5 py-1 text-[11px] font-bold tracking-[0.2em] text-gold">
        ⚽ {edition.toUpperCase()}
      </span>

      <h1 className="text-gold-gradient animate-shimmer mb-2 font-display text-[clamp(42px,10vw,88px)] leading-none tracking-[0.02em]">
        Group Stage
        <br />
        Pick-Em
      </h1>

      <p className="text-sm text-muted" style={{ marginBottom: pot > 0 ? 20 : 0 }}>
        {tagline}
      </p>

      {pot > 0 && (
        <div className="inline-flex items-center gap-2 rounded-[10px] border border-gold/25 bg-gold/[0.08] px-5 py-2.5">
          <span className="text-xs text-muted">Current Pot</span>
          <span className="text-[22px] font-extrabold text-gold-light">${pot}</span>
          <span className="text-[11px] text-muted">
            · Round ${Math.round(pot * roundWinnerShare)} · Total ${Math.round(pot * championShare)}
          </span>
        </div>
      )}
    </header>
  );
}
