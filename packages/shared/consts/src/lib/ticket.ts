import type { TicketPriority, TicketStatus } from '@org/types';

export const TICKET_PRIORITIES: { value: TicketPriority; label: string; key: string }[] = [
  { value: 1, label: 'Low', key: 'low' },
  { value: 2, label: 'Medium', key: 'medium' },
  { value: 3, label: 'High', key: 'high' },
];

export const DEFAULT_TICKET_PRIORITY: TicketPriority = 2;

export const TICKET_STATUSES: { value: TicketStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export const DEFAULT_TICKET_STATUS: TicketStatus = TICKET_STATUSES[0].value;
