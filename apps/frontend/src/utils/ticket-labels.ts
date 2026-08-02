import type { TicketPriority, TicketStatus } from '@org/types';
import { ASSIGNEES, TICKET_PRIORITIES, TICKET_STATUSES } from '@org/consts';

export function getPriorityLabel(priority: TicketPriority): string {
  return TICKET_PRIORITIES.find((option) => option.value === priority)?.label ?? String(priority);
}

export function getPriorityKey(priority: TicketPriority): string {
  return TICKET_PRIORITIES.find((option) => option.value === priority)?.key ?? 'medium';
}

export function getStatusLabel(status: TicketStatus): string {
  return TICKET_STATUSES.find((option) => option.value === status)?.label ?? status;
}

export function findAssignee(assigneeId: string | undefined) {
  return ASSIGNEES.find((option) => option.id === assigneeId);
}
