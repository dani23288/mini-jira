import type { ITicket, TicketStatus } from '@org/types';

export interface IListViewProps {
  tickets: ITicket[];
  onEditTicket: (ticket: ITicket) => void;
  onDeleteTicket: (ticket: ITicket) => void;
  onStatusChange: (ticket: ITicket, status: TicketStatus) => void;
}
