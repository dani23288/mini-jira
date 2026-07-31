import type { ITicket, TicketStatus } from '@org/types';

export interface ITicketCardProps {
  ticket: ITicket;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: TicketStatus) => void;
}

export interface ITicketCardOverlayProps {
  ticket: ITicket;
}
