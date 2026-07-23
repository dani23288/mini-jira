import { generateKeyBetween } from 'fractional-indexing';
import type { TicketStatus } from '@org/types';

export function getRankForEnd(sortedRanksInColumn: string[]): string {
  const lastRank = sortedRanksInColumn[sortedRanksInColumn.length - 1] ?? null;
  return generateKeyBetween(lastRank, null);
}

export function getRankForIndex(sortedRanksInColumn: string[], index: number): string {
  const before = sortedRanksInColumn[index - 1] ?? null;
  const after = sortedRanksInColumn[index] ?? null;
  return generateKeyBetween(before, after);
}

// Assigns each item a rank placing it at the end of its status column, in input order
// (so items already grouped/ordered by status keep that relative order within each column).
export function assignSequentialRanks<T extends { status: TicketStatus }>(
  items: T[],
): (T & { rank: string })[] {
  const lastRankByStatus: Partial<Record<TicketStatus, string>> = {};
  return items.map((item) => {
    const previousRank = lastRankByStatus[item.status];
    const rank = getRankForEnd(previousRank ? [previousRank] : []);
    lastRankByStatus[item.status] = rank;
    return { ...item, rank };
  });
}
