import type { Active, Over } from '@dnd-kit/core';
import type { ITicket, TicketPriority, TicketStatus } from '@org/types';
import { UNASSIGNED_ASSIGNEE_ID } from '@org/consts';

export interface ITicketFilters {
  query: string;
  priorities: TicketPriority[];
  assigneeIds: string[];
}

export function filterTickets(tickets: ITicket[], filters: ITicketFilters): ITicket[] {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return tickets.filter((ticket) => {
    if (normalizedQuery && !ticket.title.toLowerCase().includes(normalizedQuery)) {
      return false;
    }
    if (filters.priorities.length > 0 && !filters.priorities.includes(ticket.priority)) {
      return false;
    }
    if (filters.assigneeIds.length > 0) {
      const assigneeValue = ticket.assigneeId ?? UNASSIGNED_ASSIGNEE_ID;
      if (!filters.assigneeIds.includes(assigneeValue)) {
        return false;
      }
    }
    return true;
  });
}

export function toggleValue<T>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
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
