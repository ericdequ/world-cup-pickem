"use client";

import { useAsyncData } from "@/hooks/useAsyncData";
import { getGlobalTournament, explorerUrl, operatorTake, prizePool } from "@/lib/crypto/pot";
import type { GlobalTournament } from "@/lib/types";

const PLACEHOLDER: GlobalTournament = {
  id: "loading",
  name: "Global Pool",
  entryFee: 10,
  rake: 0.1,
  entrants: 0,
  potUsdc: 0,
  chain: "base-sepolia",
};

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-pitch-border bg-pitch-card px-3 py-4 text-center">
      <div className={accent ? "text-2xl font-extrabold text-gold-light" : "text-2xl font-extrabold text-cream"}>
        {value}
      </div>
      <div className="mt-1 text-[11px] font-semibold text-muted">{label}</div>
    </div>
  );
}

export function PotPanel() {
  const { data: t } = useAsyncData<GlobalTournament>(getGlobalTournament, [], PLACEHOLDER);
  const link = explorerUrl(t);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-gold/25 bg-[linear-gradient(180deg,rgba(201,168,76,0.1),transparent)] p-5 text-center">
        <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold">
          {t.name}
        </div>
        <div className="mt-2 text-5xl font-extrabold text-gold-light">
          ${t.potUsdc.toLocaleString()}
        </div>
        <div className="text-[12px] text-muted">USDC in pot · {t.entrants} players</div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <Stat label="Entry" value={`$${t.entryFee}`} />
        <Stat label="Prize Pool" value={`$${prizePool(t.entrants).toLocaleString()}`} accent />
        <Stat label={`Operator (${Math.round(t.rake * 100)}%)`} value={`$${operatorTake(t.entrants)}`} />
      </div>

      <div className="rounded-xl border border-pitch-border bg-pitch-card p-4 text-[12px] leading-relaxed text-ink">
        <div className="mb-1 font-semibold text-cream">🔒 Transparent & non-custodial</div>
        Entries are held in a USDC escrow contract on{" "}
        <span className="text-gold-light">{t.chain === "base" ? "Base" : "Base Sepolia (testnet)"}</span>.
        Anyone can verify the pot balance and entrant count on-chain — funds aren’t held by an operator.
        {link ? (
          <>
            {" "}
            <a href={link} target="_blank" rel="noreferrer" className="text-gold underline">
              View contract ↗
            </a>
          </>
        ) : (
          <span className="text-muted"> Contract deploys before launch — currently in test mode.</span>
        )}
      </div>

      <button
        disabled
        className="cursor-not-allowed rounded-xl border border-dashed border-pitch-border py-3 text-[13px] font-semibold text-muted"
      >
        Join for ${t.entryFee} USDC — coming soon (testnet first)
      </button>

      <p className="text-center text-[11px] text-muted">
        Paid contests are regulated. Eligibility, geofencing & terms apply at launch.
      </p>
    </div>
  );
}
