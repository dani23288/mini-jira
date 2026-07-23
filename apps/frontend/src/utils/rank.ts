import { generateKeyBetween } from 'fractional-indexing';

export function getRankForEnd(sortedRanksInColumn: string[]): string {
  const lastRank = sortedRanksInColumn[sortedRanksInColumn.length - 1] ?? null;
  return generateKeyBetween(lastRank, null);
}

export function getRankForIndex(sortedRanksInColumn: string[], index: number): string {
  const before = sortedRanksInColumn[index - 1] ?? null;
  const after = sortedRanksInColumn[index] ?? null;
  return generateKeyBetween(before, after);
}
