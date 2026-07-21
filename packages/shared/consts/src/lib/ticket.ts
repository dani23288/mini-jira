import type { TicketPriority, TicketStatus } from '@org/types';

export const TICKET_PRIORITIES: { value: TicketPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const DEFAULT_TICKET_PRIORITY: TicketPriority = 'medium';

export const TICKET_STATUSES: { value: TicketStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export const DEFAULT_TICKET_STATUS: TicketStatus = TICKET_STATUSES[0].value;
