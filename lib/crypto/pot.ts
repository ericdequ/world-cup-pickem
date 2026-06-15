import { ENTRY_FEE, OPERATOR_RAKE } from "./config";

/**
 * Pure pot economics. Entry fee + rake come from config (env-overridable), so
 * "$10 entry, 10% rake = $1/entry" is a one-place change.
 */
export { ENTRY_FEE, OPERATOR_RAKE };

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Operator revenue for a given number of entrants. */
export const operatorTake = (entrants: number, fee = ENTRY_FEE, rake = OPERATOR_RAKE): number =>
  round2(entrants * fee * rake);

/** Amount paid out to players (pot minus rake). */
export const prizePool = (entrants: number, fee = ENTRY_FEE, rake = OPERATOR_RAKE): number =>
  round2(entrants * fee * (1 - rake));
