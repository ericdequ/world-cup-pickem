"use client";

import { useCallback, useEffect, useState } from "react";
import type { Address, EIP1193Provider } from "viem";
import { activeChain } from "@/lib/crypto/config";

/** Loosely-typed view of `request` for non-standard wallet RPC calls. */
type RawRequest = (args: { method: string; params?: unknown[] }) => Promise<unknown>;

function getProvider(): EIP1193Provider | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { ethereum?: EIP1193Provider }).ethereum ?? null;
}

/** Ask the wallet to switch to (or add) the active chain. Best-effort. */
async function ensureChain(provider: EIP1193Provider) {
  const raw = provider.request as unknown as RawRequest;
  const chainId = `0x${activeChain.id.toString(16)}`;
  try {
    await raw({ method: "wallet_switchEthereumChain", params: [{ chainId }] });
  } catch (e) {
    if ((e as { code?: number }).code === 4902) {
      await raw({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId,
            chainName: activeChain.name,
            nativeCurrency: activeChain.nativeCurrency,
            rpcUrls: activeChain.rpcUrls.default.http,
            blockExplorerUrls: activeChain.blockExplorers
              ? [activeChain.blockExplorers.default.url]
              : [],
          },
        ],
      });
    }
  }
}

/**
 * Connect to an injected wallet (MetaMask, Coinbase Wallet, Rabby, …) via the
 * EIP-1193 standard. No extra SDK, no project keys — the user signs everything.
 */
export function useWallet() {
  const [address, setAddress] = useState<Address | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const provider = getProvider();

  // Restore an existing session + react to account changes.
  useEffect(() => {
    const p = getProvider();
    if (!p) return;
    const raw = p.request as unknown as RawRequest;
    raw({ method: "eth_accounts" })
      .then((accts) => setAddress(((accts as Address[]) ?? [])[0] ?? null))
      .catch(() => {});

    const onAccounts = (...args: unknown[]) =>
      setAddress(((args[0] as Address[]) ?? [])[0] ?? null);
    p.on?.("accountsChanged", onAccounts);
    return () => p.removeListener?.("accountsChanged", onAccounts);
  }, []);

  const connect = useCallback(async () => {
    const p = getProvider();
    if (!p) {
      setError("No wallet found. Install MetaMask or Coinbase Wallet.");
      return;
    }
    setConnecting(true);
    setError(null);
    try {
      const raw = p.request as unknown as RawRequest;
      const accts = (await raw({ method: "eth_requestAccounts" })) as Address[];
      setAddress(accts[0] ?? null);
      await ensureChain(p);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => setAddress(null), []);

  return {
    address,
    available: Boolean(provider),
    connecting,
    error,
    provider,
    connect,
    disconnect,
  };
}
