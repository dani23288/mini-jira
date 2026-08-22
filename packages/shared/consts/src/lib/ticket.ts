import type { SortDirection, TicketPriority, TicketSortField, TicketStatus } from '@org/types';

export const TICKET_PRIORITIES: { value: TicketPriority; label: string; key: string }[] = [
  { value: 1, label: 'Low', key: 'low' },
  { value: 2, label: 'Medium', key: 'medium' },
  { value: 3, label: 'High', key: 'high' },
];

export const TICKET_PRIORITY_VALUES: TicketPriority[] = TICKET_PRIORITIES.map((option) => option.value);

export const DEFAULT_TICKET_PRIORITY: TicketPriority = 2;

export const TICKET_STATUSES: { value: TicketStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export const TICKET_STATUS_VALUES: TicketStatus[] = TICKET_STATUSES.map((option) => option.value);

export const DEFAULT_TICKET_STATUS: TicketStatus = TICKET_STATUSES[0].value;

export const TICKET_SORT_FIELDS: TicketSortField[] = ['rank', 'priority', 'createdAt'];

export const SORT_DIRECTIONS: SortDirection[] = ['asc', 'desc'];
