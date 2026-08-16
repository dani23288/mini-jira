import type { SortDirection } from '@org/types';

export const getAriaSortCases: { name: string; direction: SortDirection | null; expected: string }[] = [
  { name: 'no direction', direction: null, expected: 'none' },
  { name: 'ascending', direction: 'asc', expected: 'ascending' },
  { name: 'descending', direction: 'desc', expected: 'descending' },
];
