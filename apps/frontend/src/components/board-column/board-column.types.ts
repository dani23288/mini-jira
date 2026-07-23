import type { ITicket, TicketStatus } from '@org/types';

export interface IBoardColumnProps {
  status: TicketStatus;
  label: string;
  tickets: ITicket[];
  isDropTarget: boolean;
  onEditTicket: (ticket: ITicket) => void;
  onDeleteTicket: (ticket: ITicket) => void;
  onStatusChange: (ticket: ITicket, status: TicketStatus) => void;
}
