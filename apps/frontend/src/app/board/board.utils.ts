import type { Active, Over } from '@dnd-kit/core';
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

// Index within `destinationColumnTickets` where a dragged ticket should land: past
// the end when dropped on the column itself, otherwise before/after `overTicket`
// depending on which half of it the pointer is over.
export function getDropInsertIndex(
  destinationColumnTickets: ITicket[],
  overTicket: ITicket | undefined,
  active: Active,
  over: Over,
): number {
  if (!overTicket) {
    return destinationColumnTickets.length;
  }

  const overIndex = destinationColumnTickets.findIndex((ticket) => ticket.id === overTicket.id);
  const activeRect = active.rect.current.translated;
  const isPastOverCenter = activeRect
    ? activeRect.top + activeRect.height / 2 > over.rect.top + over.rect.height / 2
    : false;
  return isPastOverCenter ? overIndex + 1 : overIndex;
}
