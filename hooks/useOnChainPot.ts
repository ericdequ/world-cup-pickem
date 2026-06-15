"use client";

import { useEffect, useState } from "react";
import { readPot, type OnChainPot } from "@/lib/crypto/escrow";
import { escrowAddress } from "@/lib/crypto/config";

/**
 * Live pot + entrant count read from the escrow contract, polled periodically.
 * `configured` is false until a contract address is set (test mode), in which
 * case nothing is fetched and the panel shows placeholders.
 */
export function useOnChainPot(pollMs = 15_000) {
  const [pot, setPot] = useState<OnChainPot | null>(null);
  const [loading, setLoading] = useState(Boolean(escrowAddress));

  useEffect(() => {
    if (!escrowAddress) return;
    let active = true;

    const run = async () => {
      const data = await readPot().catch(() => null);
      if (!active) return;
      setPot(data);
      setLoading(false);
    };

    run();
    const id = setInterval(run, pollMs);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [pollMs]);

  return { pot, loading, configured: Boolean(escrowAddress) };
}
