import type { Active, CollisionDetection, Over } from '@dnd-kit/core';
import { closestCenter, pointerWithin } from '@dnd-kit/core';
import type { ITicket, TicketPriority, TicketStatus } from '@org/types';
import { TICKET_STATUSES, UNASSIGNED_ASSIGNEE_ID } from '@org/consts';

export interface ITicketFilters {
  query: string;
  priorities: TicketPriority[];
  assigneeIds: string[];
}

function matchesQuery(ticket: ITicket, normalizedQuery: string): boolean {
  return !normalizedQuery || ticket.title.toLowerCase().includes(normalizedQuery);
}

function matchesPriority(ticket: ITicket, priorities: TicketPriority[]): boolean {
  return priorities.length === 0 || priorities.includes(ticket.priority);
}

function matchesAssignee(ticket: ITicket, assigneeIds: string[]): boolean {
  return assigneeIds.length === 0 || assigneeIds.includes(ticket.assigneeId ?? UNASSIGNED_ASSIGNEE_ID);
}

export function filterTickets(tickets: ITicket[], filters: ITicketFilters): ITicket[] {
  const normalizedQuery = filters.query.trim().toLowerCase();
  return tickets.filter(
    (ticket) =>
      matchesQuery(ticket, normalizedQuery) &&
      matchesPriority(ticket, filters.priorities) &&
      matchesAssignee(ticket, filters.assigneeIds),
  );
}

export function toggleValue<T>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function findTicketById(tickets: ITicket[], id: string): ITicket | undefined {
  return tickets.find((ticket) => ticket.id === id);
}

export function isTicketStatus(value: string): value is TicketStatus {
  return TICKET_STATUSES.some((status) => status.value === value);
}

export function resolveDestinationStatus(tickets: ITicket[], overId: string): TicketStatus | null {
  const overTicket = findTicketById(tickets, overId);
  return overTicket?.status ?? (isTicketStatus(overId) ? overId : null);
}

export function getTicketsByStatus(tickets: ITicket[], status: TicketStatus): ITicket[] {
  return tickets
    .filter((ticket) => ticket.status === status)
    .sort((a, b) => (a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0));
}

// Past the end when dropped on the column itself, else before/after `overTicket` by pointer half.
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

// A column-container hit (not a card) re-runs closestCenter scoped to that column's cards for precision.
export function getBoardCollisionDetection(tickets: ITicket[]): CollisionDetection {
  return (args) => {
    const pointerCollisions = pointerWithin(args);
    const collisions = pointerCollisions.length > 0 ? pointerCollisions : closestCenter(args);
    const firstCollision = collisions[0];
    if (!firstCollision) {
      return collisions;
    }

    const overId = String(firstCollision.id);
    if (findTicketById(tickets, overId) || !isTicketStatus(overId)) {
      return collisions;
    }

    const columnTicketIds = new Set(
      tickets.filter((ticket) => ticket.status === overId).map((ticket) => ticket.id),
    );
    if (columnTicketIds.size === 0) {
      return collisions;
    }

    const scopedContainers = args.droppableContainers.filter((container) =>
      columnTicketIds.has(String(container.id)),
    );
    const scopedCollisions = closestCenter({ ...args, droppableContainers: scopedContainers });
    return scopedCollisions.length > 0 ? scopedCollisions : collisions;
  };
}
