"use client";

import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/Button";

const shorten = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

export function ConnectWallet() {
  const { address, connect, disconnect, connecting, error, available } = useWallet();

  if (address) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-pitch-border bg-pitch-card px-4 py-3">
        <span className="text-[13px] font-semibold text-cream">
          🟢 {shorten(address)}
        </span>
        <Button variant="ghost" onClick={disconnect} className="px-3 py-1.5 text-[12px]">
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={connect} disabled={connecting}>
        {connecting ? "Connecting…" : available ? "Connect Wallet" : "Get a Wallet"}
      </Button>
      {error && <p className="text-[12px] text-red-400">{error}</p>}
    </div>
  );
}
