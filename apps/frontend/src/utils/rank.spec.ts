import { describe, expect, it } from 'vitest';
import { assignSequentialRanks, getRankForEnd, getRankForIndex } from './rank';

describe('getRankForEnd', () => {
  it('returns a rank when the column is empty', () => {
    expect(getRankForEnd([])).toBeTruthy();
  });

  it('returns a rank that sorts after the last rank in the column', () => {
    const first = getRankForEnd([]);
    const second = getRankForEnd([first]);
    const third = getRankForEnd([first, second]);

    expect([first, second, third].slice().sort()).toEqual([first, second, third]);
  });
});

describe('getRankForIndex', () => {
  it('returns a rank when the column is empty', () => {
    expect(getRankForIndex([], 0)).toBeTruthy();
  });

  it('returns a rank before the first item when inserting at index 0', () => {
    const existing = getRankForEnd([]);
    const inserted = getRankForIndex([existing], 0);

    expect(inserted < existing).toBe(true);
  });

  it('returns a rank after the last item when inserting past the end', () => {
    const existing = getRankForEnd([]);
    const inserted = getRankForIndex([existing], 1);

    expect(inserted > existing).toBe(true);
  });

  it('returns a rank strictly between its neighbors when inserting in the middle', () => {
    const first = getRankForEnd([]);
    const third = getRankForEnd([first]);
    const inserted = getRankForIndex([first, third], 1);

    expect(inserted > first).toBe(true);
    expect(inserted < third).toBe(true);
  });
});

describe('assignSequentialRanks', () => {
  it('gives each item a rank', () => {
    const result = assignSequentialRanks([
      { status: 'todo' as const },
      { status: 'todo' as const },
      { status: 'done' as const },
    ]);

    expect(result.every((item) => item.rank)).toBe(true);
  });

  it('keeps input order within each status column', () => {
    const result = assignSequentialRanks([
      { id: 'a', status: 'todo' as const },
      { id: 'b', status: 'done' as const },
      { id: 'c', status: 'todo' as const },
    ]);

    const todoRanks = result.filter((item) => item.status === 'todo').map((item) => item.rank);
    expect(todoRanks).toEqual([...todoRanks].sort());
  });
});
