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
import { getRankForEnd } from '../utils/rank';

function ranksForStatus(tickets: ITicket[], status: TicketStatus, excludeId?: string): string[] {
  return tickets
    .filter((ticket) => ticket.status === status && ticket.id !== excludeId)
    .map((ticket) => ticket.rank)
    .sort();
}

export function useTickets(): IUseTicketsResult {
  const [tickets, setTickets] = useState<ITicket[]>(createMockTickets);

  const createTicket = (input: ICreateTicketInput): ITicket => {
    const status = input.status ?? DEFAULT_TICKET_STATUS;
    const ticket: ITicket = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      status,
      priority: input.priority ?? DEFAULT_TICKET_PRIORITY,
      assigneeId: input.assigneeId,
      rank: getRankForEnd(ranksForStatus(tickets, status)),
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
    setTickets((prev) => {
      const rank = getRankForEnd(ranksForStatus(prev, status, id));
      return prev.map((ticket) => (ticket.id === id ? { ...ticket, status, rank } : ticket));
    });
  };

  const moveTicket = (id: string, status: TicketStatus, rank: string): void => {
    setTickets((prev) =>
      prev.map((ticket) => (ticket.id === id ? { ...ticket, status, rank } : ticket)),
    );
  };

  const deleteTicket = (id: string): void => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
  };

  return { tickets, createTicket, updateTicket, updateStatus, moveTicket, deleteTicket };
}
