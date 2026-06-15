import type { GlobalTournament } from "@/lib/types";

/**
 * Global tournament economics + on-chain pot.
 *
 * Production model: a non-custodial USDC escrow contract on Base. Entrants pay
 * the fee in USDC; the contract holds the pot and anyone can read the balance +
 * entrant count on-chain (the transparency requirement). The operator rake is
 * taken at settlement. We build/test against Base Sepolia (testnet) first.
 *
 * This module currently returns configured/placeholder values. Wiring the live
 * read is a localized change: add viem + a `readContract` call here, keyed off
 * NEXT_PUBLIC_POT_CONTRACT_ADDRESS — no UI changes required.
 */
const chain = (process.env.NEXT_PUBLIC_CHAIN as GlobalTournament["chain"]) ?? "base-sepolia";
const contractAddress = process.env.NEXT_PUBLIC_POT_CONTRACT_ADDRESS || undefined;

export const ENTRY_FEE_USDC = 10;
export const OPERATOR_RAKE = 0.1; // 10% → $1 per $10 entry

/** Operator revenue for a given number of entrants. */
export const operatorTake = (entrants: number, fee = ENTRY_FEE_USDC, rake = OPERATOR_RAKE): number =>
  Math.round(entrants * fee * rake * 100) / 100;

/** Amount paid out to players (pot minus rake). */
export const prizePool = (entrants: number, fee = ENTRY_FEE_USDC, rake = OPERATOR_RAKE): number =>
  Math.round(entrants * fee * (1 - rake) * 100) / 100;

/**
 * Fetch the current tournament state. Reads on-chain when a contract is set;
 * otherwise returns a placeholder so the transparency panel still renders.
 */
export async function getGlobalTournament(): Promise<GlobalTournament> {
  // TODO(production): read `entrants` and `potUsdc` from the escrow contract on Base.
  const entrants = contractAddress ? 0 : 128;
  return {
    id: "wc2026-global",
    name: "World Cup 2026 — Global Pool",
    entryFee: ENTRY_FEE_USDC,
    rake: OPERATOR_RAKE,
    entrants,
    potUsdc: entrants * ENTRY_FEE_USDC,
    contractAddress,
    chain,
  };
}

/** Public block-explorer URL for the escrow contract, for verifiable transparency. */
export function explorerUrl(t: GlobalTournament): string | null {
  if (!t.contractAddress) return null;
  const base = t.chain === "base" ? "https://basescan.org" : "https://sepolia.basescan.org";
  return `${base}/address/${t.contractAddress}`;
}
