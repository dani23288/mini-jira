import type { TicketPriority } from '@org/types';
import { getPriorityKey } from './ticket-labels';

export function getPriorityColorVar(priority: TicketPriority): string {
  return `var(--color-priority-${getPriorityKey(priority)})`;
}
