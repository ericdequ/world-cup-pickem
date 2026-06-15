"use client";

import { useState } from "react";
import { useOnChainPot } from "@/hooks/useOnChainPot";
import { useWallet } from "@/hooks/useWallet";
import { enterPool } from "@/lib/crypto/escrow";
import { ENTRY_FEE, OPERATOR_RAKE, operatorTake, prizePool } from "@/lib/crypto/pot";
import {
  chainKey,
  escrowAddress,
  stablecoin,
  explorerAddressUrl,
} from "@/lib/crypto/config";
import { ConnectWallet } from "@/components/crypto/ConnectWallet";

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
  const { pot, configured } = useOnChainPot();
  const { address, provider } = useWallet();
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);

  const entrants = pot?.entrants ?? 0;
  const potValue = pot?.potUsdc ?? 0;
  const onTestnet = chainKey !== "base";

  const join = async () => {
    if (!provider || !address) return;
    setJoining(true);
    setJoinError(null);
    try {
      await enterPool(provider, address);
      setJoined(true);
    } catch (e) {
      setJoinError((e as Error).message);
    } finally {
      setJoining(false);
    }
  };

  const canJoin = configured && Boolean(address) && !joined;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-gold/25 bg-[linear-gradient(180deg,rgba(201,168,76,0.1),transparent)] p-5 text-center">
        <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold">
          World Cup Global Pool
        </div>
        <div className="mt-2 text-5xl font-extrabold text-gold-light">
          {stablecoin.symbol === "USDC" ? "$" : ""}
          {potValue.toLocaleString()}
        </div>
        <div className="text-[12px] text-muted">
          {stablecoin.symbol} in pot · {entrants} {entrants === 1 ? "player" : "players"}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <Stat label="Entry" value={`${ENTRY_FEE} ${stablecoin.symbol}`} />
        <Stat label="Prize Pool" value={prizePool(entrants).toLocaleString()} accent />
        <Stat label={`Operator (${Math.round(OPERATOR_RAKE * 100)}%)`} value={`${operatorTake(entrants)}`} />
      </div>

      <div className="rounded-xl border border-pitch-border bg-pitch-card p-4 text-[12px] leading-relaxed text-ink">
        <div className="mb-1 font-semibold text-cream">🔒 Transparent &amp; non-custodial</div>
        Entries are held in a {stablecoin.symbol} escrow contract on{" "}
        <span className="text-gold-light">
          {onTestnet ? "Base Sepolia (testnet)" : "Base"}
        </span>
        . Anyone can verify the pot and entrant count on-chain — no operator holds the funds.
        {escrowAddress ? (
          <>
            {" "}
            <a
              href={explorerAddressUrl(escrowAddress)}
              target="_blank"
              rel="noreferrer"
              className="text-gold underline"
            >
              View contract ↗
            </a>
          </>
        ) : (
          <span className="text-muted"> Contract deploys before launch — currently test mode.</span>
        )}
      </div>

      <ConnectWallet />

      <button
        onClick={join}
        disabled={!canJoin || joining}
        className="rounded-xl border border-gold/40 bg-gold/10 py-3 text-[13px] font-bold text-gold-light transition-colors enabled:hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {joined
          ? "✓ You're in — good luck!"
          : joining
            ? "Confirming in wallet…"
            : !configured
              ? `Join for ${ENTRY_FEE} ${stablecoin.symbol} — coming soon (testnet first)`
              : !address
                ? "Connect a wallet to join"
                : `Join for ${ENTRY_FEE} ${stablecoin.symbol}`}
      </button>
      {joinError && <p className="text-center text-[12px] text-red-400">{joinError}</p>}

      <p className="text-center text-[11px] text-muted">
        Paid contests are regulated. Eligibility, geofencing &amp; terms apply at launch.
      </p>
    </div>
  );
}
