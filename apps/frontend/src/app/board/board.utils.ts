import type { ITicket, TicketStatus } from '@org/types';

export function filterTicketsByQuery(tickets: ITicket[], query: string): ITicket[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return tickets;
  }
  return tickets.filter((ticket) => ticket.title.toLowerCase().includes(normalizedQuery));
}

export function getTicketsByStatus(tickets: ITicket[], status: TicketStatus): ITicket[] {
  return tickets
    .filter((ticket) => ticket.status === status)
    .sort((a, b) => (a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0));
}
