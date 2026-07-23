import type { TicketPriority } from '@org/types';

export interface IPriorityFilterProps {
  selected: TicketPriority[];
  onToggle: (priority: TicketPriority) => void;
}
