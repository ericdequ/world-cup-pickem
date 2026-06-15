import { createPublicClient, http, type PublicClient } from "viem";
import { activeChain } from "./config";

/**
 * Read-only chain client. Used for public reads (pot balance, entrant count) —
 * no wallet or private key involved, so it's safe to run anywhere in the app.
 */
export const publicClient: PublicClient = createPublicClient({
  chain: activeChain,
  transport: http(),
});
