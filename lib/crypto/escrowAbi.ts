/**
 * Minimal ABI for the PoolEscrow contract (see ./escrow/PoolEscrow.sol).
 * `as const` lets viem fully type-check reads/writes against it.
 */
export const poolEscrowAbi = [
  {
    type: "function",
    name: "entryFee",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "totalPot",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "entrantCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "hasEntered",
    stateMutability: "view",
    inputs: [{ name: "who", type: "address" }],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "enter",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
] as const;
