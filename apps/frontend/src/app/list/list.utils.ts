import type { ITicket, SortDirection } from '@org/types';

export function sortTicketsByPriority(tickets: ITicket[], direction: SortDirection): ITicket[] {
  const sign = direction === 'asc' ? 1 : -1;
  return [...tickets].sort((a, b) => (a.priority - b.priority) * sign);
}

export function getAriaSort(direction: SortDirection | null): 'ascending' | 'descending' | 'none' {
  if (!direction) {
    return 'none';
  }
  return direction === 'asc' ? 'ascending' : 'descending';
}
