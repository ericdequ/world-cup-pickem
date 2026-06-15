import type { Address } from "viem";

/**
 * Stablecoin registry.
 *
 * The pot is denominated in a stablecoin so a "$10 entry" stays $10. To support
 * a different host country's currency, add its stablecoin here (e.g. EURC for a
 * European edition, or a future MXNe/BRLA for Mexico/Brazil) and point
 * NEXT_PUBLIC_STABLECOIN at its symbol — nothing else changes.
 *
 * Addresses are token contracts on the given chain. ALWAYS verify an address
 * against the issuer's official docs before mainnet use.
 */
export interface Stablecoin {
  symbol: string;
  name: string;
  /** ERC-20 decimals (USDC/EURC = 6). Used to convert human ↔ on-chain amounts. */
  decimals: number;
  address: Address;
}

export type ChainKey = "base" | "base-sepolia";

export const STABLECOINS: Record<ChainKey, Record<string, Stablecoin>> = {
  base: {
    // Circle USDC on Base — https://developers.circle.com/stablecoins/usdc-on-main-networks
    USDC: {
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    },
    // Circle EURC on Base — example for a Euro-denominated edition.
    EURC: {
      symbol: "EURC",
      name: "Euro Coin",
      decimals: 6,
      address: "0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42",
    },
  },
  "base-sepolia": {
    // Circle USDC testnet on Base Sepolia — free to mint from Circle's faucet.
    USDC: {
      symbol: "USDC",
      name: "USD Coin (testnet)",
      decimals: 6,
      address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    },
  },
};
