import type { ITicket } from '@org/types';

// Apollo response shapes, keyed by GraphQL operation name — no server-side TS equivalent to
// reuse (NestJS GraphQL resolvers return TicketModel/boolean directly, not these wrappers).
export interface ITicketsQueryData {
  tickets: ITicket[];
}

export interface ICreateTicketData {
  createTicket: ITicket;
}

export interface IUpdateTicketData {
  updateTicket: ITicket;
}

export interface IDeleteTicketData {
  deleteTicket: boolean;
}
