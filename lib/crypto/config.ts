import { base, baseSepolia } from "viem/chains";
import type { Address, Chain } from "viem";
import { STABLECOINS, type ChainKey, type Stablecoin } from "./stablecoins";

/**
 * Central crypto config, all env-driven so nothing is hard-coded:
 *
 *   NEXT_PUBLIC_CHAIN                 "base" | "base-sepolia" (default: testnet)
 *   NEXT_PUBLIC_STABLECOIN           symbol from the registry  (default: "USDC")
 *   NEXT_PUBLIC_POT_CONTRACT_ADDRESS deployed PoolEscrow address (optional)
 *   NEXT_PUBLIC_ENTRY_FEE            entry fee in stablecoin units (default: 10)
 *   NEXT_PUBLIC_OPERATOR_RAKE        operator share 0–1         (default: 0.1)
 */
export const chainKey: ChainKey =
  process.env.NEXT_PUBLIC_CHAIN === "base" ? "base" : "base-sepolia";

export const activeChain: Chain = chainKey === "base" ? base : baseSepolia;

/** The stablecoin the pot is denominated in. Swap via NEXT_PUBLIC_STABLECOIN. */
export const stablecoin: Stablecoin =
  STABLECOINS[chainKey][process.env.NEXT_PUBLIC_STABLECOIN ?? "USDC"] ??
  STABLECOINS[chainKey].USDC;

export const escrowAddress: Address | undefined =
  (process.env.NEXT_PUBLIC_POT_CONTRACT_ADDRESS as Address | undefined) || undefined;

export const ENTRY_FEE = Number(process.env.NEXT_PUBLIC_ENTRY_FEE ?? 10);
export const OPERATOR_RAKE = Number(process.env.NEXT_PUBLIC_OPERATOR_RAKE ?? 0.1);

export const isMainnet = chainKey === "base";

/** Block-explorer URL for an address on the active chain (verifiable transparency). */
export function explorerAddressUrl(address: Address): string {
  const base = isMainnet ? "https://basescan.org" : "https://sepolia.basescan.org";
  return `${base}/address/${address}`;
}
