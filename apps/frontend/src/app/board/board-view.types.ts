import type { ITicket, IUseTicketsResult, TicketStatus } from '@org/types';

export interface IBoardViewProps {
  tickets: ITicket[];
  onEditTicket: (ticket: ITicket) => void;
  onDeleteTicket: (ticket: ITicket) => void;
  onStatusChange: (ticket: ITicket, status: TicketStatus) => void;
  moveTicket: IUseTicketsResult['moveTicket'];
}
