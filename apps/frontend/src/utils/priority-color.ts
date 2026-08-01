import type { TicketPriority } from '@org/types';

export function getPriorityColorVar(priority: TicketPriority): string {
  return `var(--color-priority-${priority})`;
}
