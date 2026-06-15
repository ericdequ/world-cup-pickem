/** Shared grid template so the header row and player rows stay aligned:
 *  [rank] [name] [...one column per round] [total] */
export const rowColumns = (roundCount: number): string =>
  `40px 1fr repeat(${roundCount + 1}, 56px)`;
