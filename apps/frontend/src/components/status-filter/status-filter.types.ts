import type { TicketStatus } from '@org/types';

export interface IStatusFilterProps {
  selected: TicketStatus[];
  onToggle: (status: TicketStatus) => void;
}
