import { useState } from 'react';
import type {
  ICreateTicketInput,
  ITicket,
  IUpdateTicketInput,
  IUseTicketsResult,
  TicketStatus,
} from '@org/types';
import { DEFAULT_TICKET_PRIORITY, DEFAULT_TICKET_STATUS } from '@org/consts';
import { createMockTickets } from '../data/mock-tickets';

export function useTickets(): IUseTicketsResult {
  const [tickets, setTickets] = useState<ITicket[]>(createMockTickets);

  const createTicket = (input: ICreateTicketInput): ITicket => {
    const ticket: ITicket = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      status: input.status ?? DEFAULT_TICKET_STATUS,
      priority: input.priority ?? DEFAULT_TICKET_PRIORITY,
      createdAt: new Date().toISOString(),
    };
    setTickets((prev) => [...prev, ticket]);
    return ticket;
  };

  const updateTicket = (id: string, changes: IUpdateTicketInput): void => {
    setTickets((prev) =>
      prev.map((ticket) => (ticket.id === id ? { ...ticket, ...changes } : ticket)),
    );
  };

  const updateStatus = (id: string, status: TicketStatus): void => {
    updateTicket(id, { status });
  };

  const deleteTicket = (id: string): void => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
  };

  return { tickets, createTicket, updateTicket, updateStatus, deleteTicket };
}
