export type TicketPriority = 'low' | 'medium' | 'high';

export type TicketStatus = 'todo' | 'in-progress' | 'done';

export interface ITicket {
  id: string;
  title: string;
  description?: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
}

export interface ICreateTicketInput {
  title: string;
  description?: string;
  priority?: TicketPriority;
  status?: TicketStatus;
}

export interface IUpdateTicketInput {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  status?: TicketStatus;
}

export interface IUseTicketsResult {
  tickets: ITicket[];
  createTicket(input: ICreateTicketInput): ITicket;
  updateTicket(id: string, changes: IUpdateTicketInput): void;
  updateStatus(id: string, status: TicketStatus): void;
  deleteTicket(id: string): void;
}
