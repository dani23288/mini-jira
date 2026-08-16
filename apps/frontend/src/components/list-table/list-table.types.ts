import type { ITicket, SortDirection, TicketStatus } from '@org/types';

export interface IListTableProps {
  tickets: ITicket[];
  prioritySort: SortDirection | null;
  onTogglePrioritySort: () => void;
  onEditTicket: (ticket: ITicket) => void;
  onDeleteTicket: (ticket: ITicket) => void;
  onStatusChange: (ticket: ITicket, status: TicketStatus) => void;
}

export interface IListTableRowProps {
  ticket: ITicket;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: TicketStatus) => void;
}
