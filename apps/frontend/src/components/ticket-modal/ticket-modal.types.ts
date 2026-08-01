import type { ITicket, TicketPriority, TicketStatus } from '@org/types';

export type TicketModalMode = 'create' | 'edit';

export interface ITicketFormValues {
  title: string;
  description?: string;
  priority: TicketPriority;
  status: TicketStatus;
  assigneeId?: string;
}

export interface ITicketModalProps {
  mode: TicketModalMode;
  initialTicket?: ITicket;
  onClose: () => void;
  onSubmit: (values: ITicketFormValues) => void;
}
