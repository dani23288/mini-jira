import type { TicketPriority } from '@org/types';

export const priorityBadgeCases: { name: string; priority: TicketPriority; label: string; key: string }[] = [
  { name: 'priority 1', priority: 1, label: 'Low', key: 'low' },
  { name: 'priority 2', priority: 2, label: 'Medium', key: 'medium' },
  { name: 'priority 3', priority: 3, label: 'High', key: 'high' },
];
