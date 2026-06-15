import type { Player } from "./types";

/** Sum a player's points across all rounds. */
export const playerTotal = (player: Player): number =>
  player.points.reduce((sum, pts) => sum + pts, 0);

/** Players ranked by total, highest first. Returns a new array. */
export const sortByTotal = (players: Player[]): Player[] =>
  [...players].sort((a, b) => playerTotal(b) - playerTotal(a));

/** Total pot = number of paid entrants × entry fee. */
export const calculatePot = (players: Player[], entryFee: number): number =>
  players.filter((p) => p.paid).length * entryFee;
