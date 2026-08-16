import type { SortDirection } from '@org/types';

export function getAriaSort(direction: SortDirection | null): 'ascending' | 'descending' | 'none' {
  if (!direction) {
    return 'none';
  }
  return direction === 'asc' ? 'ascending' : 'descending';
}
