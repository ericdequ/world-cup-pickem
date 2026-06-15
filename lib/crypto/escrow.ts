import {
  createWalletClient,
  custom,
  erc20Abi,
  formatUnits,
  parseUnits,
  type Address,
  type EIP1193Provider,
  type Hash,
} from "viem";
import { publicClient } from "./client";
import { poolEscrowAbi } from "./escrowAbi";
import { activeChain, escrowAddress, stablecoin, ENTRY_FEE } from "./config";

/**
 * Read + write helpers for the PoolEscrow contract (./escrow/PoolEscrow.sol).
 * Reads use the public client (no wallet). Writes use a viem wallet client built
 * over the user's injected EIP-1193 provider — the contract still does all the
 * trust-critical work on-chain; this is just the client glue.
 */

export interface OnChainPot {
  potUsdc: number;
  entrants: number;
}

/** Read the live pot + entrant count. Returns null when no contract is configured. */
export async function readPot(): Promise<OnChainPot | null> {
  if (!escrowAddress) return null;
  const [pot, entrants] = await Promise.all([
    publicClient.readContract({
      address: escrowAddress,
      abi: poolEscrowAbi,
      functionName: "totalPot",
    }),
    publicClient.readContract({
      address: escrowAddress,
      abi: poolEscrowAbi,
      functionName: "entrantCount",
    }),
  ]);
  return {
    potUsdc: Number(formatUnits(pot, stablecoin.decimals)),
    entrants: Number(entrants),
  };
}

/** Has this address already joined? */
export async function hasEntered(account: Address): Promise<boolean> {
  if (!escrowAddress) return false;
  return publicClient.readContract({
    address: escrowAddress,
    abi: poolEscrowAbi,
    functionName: "hasEntered",
    args: [account],
  });
}

/**
 * Join the pool from the connected wallet: (1) approve the escrow to pull the
 * entry fee, then (2) call `enter()`. Each step waits for confirmation.
 * Throws if the escrow isn't configured.
 */
export async function enterPool(provider: EIP1193Provider, account: Address): Promise<Hash> {
  if (!escrowAddress) throw new Error("Pool contract is not configured yet.");

  const wallet = createWalletClient({ account, chain: activeChain, transport: custom(provider) });
  const fee = parseUnits(String(ENTRY_FEE), stablecoin.decimals);

  // 1) Approve the escrow to spend exactly the entry fee.
  const approveHash = await wallet.writeContract({
    address: stablecoin.address,
    abi: erc20Abi,
    functionName: "approve",
    args: [escrowAddress, fee],
  });
  await publicClient.waitForTransactionReceipt({ hash: approveHash });

  // 2) Enter (the contract pulls the approved fee via transferFrom).
  const enterHash = await wallet.writeContract({
    address: escrowAddress,
    abi: poolEscrowAbi,
    functionName: "enter",
  });
  await publicClient.waitForTransactionReceipt({ hash: enterHash });
  return enterHash;
}
