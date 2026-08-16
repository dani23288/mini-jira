import type { SortDirection } from '@org/types';
import { makeTicket } from '../../../board/test/stubs/board.utils.stub';

const unsortedTickets = [
  makeTicket('a', { priority: 3 }),
  makeTicket('b', { priority: 1 }),
  makeTicket('c', { priority: 2 }),
];

export const sortTicketsByPriorityCases = [
  { name: 'ascending', direction: 'asc' as const, tickets: unsortedTickets, expectedIds: ['b', 'c', 'a'] },
  { name: 'descending', direction: 'desc' as const, tickets: unsortedTickets, expectedIds: ['a', 'c', 'b'] },
];

export const getAriaSortCases: { name: string; direction: SortDirection | null; expected: string }[] = [
  { name: 'no direction', direction: null, expected: 'none' },
  { name: 'ascending', direction: 'asc', expected: 'ascending' },
  { name: 'descending', direction: 'desc', expected: 'descending' },
];
