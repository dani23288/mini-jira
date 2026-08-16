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
