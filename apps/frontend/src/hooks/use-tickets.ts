import { useState } from 'react';
import type { Reference } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import type {
  ICreateTicketInput,
  ITicket,
  IUpdateTicketInput,
  IUseTicketsResult,
  TicketStatus,
} from '@org/types';
import {
  CREATE_TICKET_MUTATION,
  DELETE_TICKET_MUTATION,
  TICKETS_QUERY,
  UPDATE_TICKET_MUTATION,
} from './use-tickets.consts';

interface ITicketsQueryData {
  tickets: ITicket[];
}
interface ICreateTicketData {
  createTicket: ITicket;
}
interface IUpdateTicketData {
  updateTicket: ITicket;
}
interface IDeleteTicketData {
  deleteTicket: boolean;
}
// rank isn't part of the client-facing IUpdateTicketInput (only moveTicket sends it) — widen locally for the wire shape.
type UpdateTicketVariables = { id: string; input: IUpdateTicketInput & { rank?: string } };

export function useTickets(): IUseTicketsResult {
  const [error, setError] = useState<string | null>(null);
  const { data, loading } = useQuery<ITicketsQueryData>(TICKETS_QUERY);
  const tickets = data?.tickets ?? [];

  const [runCreateTicket] = useMutation<ICreateTicketData, { input: ICreateTicketInput }>(CREATE_TICKET_MUTATION);
  const [runUpdateTicket] = useMutation<IUpdateTicketData, UpdateTicketVariables>(UPDATE_TICKET_MUTATION);
  const [runDeleteTicket] = useMutation<IDeleteTicketData, { id: string }>(DELETE_TICKET_MUTATION);

  const runMutation = async (mutate: () => Promise<unknown>): Promise<void> => {
    try {
      setError(null);
      await mutate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const createTicket = (input: ICreateTicketInput): void => {
    void runMutation(() =>
      runCreateTicket({
        variables: { input },
        update: (cache, result) => {
          const created = result.data?.createTicket;
          if (!created) {
            return;
          }
          const existing = cache.readQuery<ITicketsQueryData>({ query: TICKETS_QUERY });
          cache.writeQuery({
            query: TICKETS_QUERY,
            data: { tickets: [...(existing?.tickets ?? []), created] },
          });
        },
      }),
    );
  };

  const updateTicket = (id: string, changes: IUpdateTicketInput): void => {
    void runMutation(() => runUpdateTicket({ variables: { id, input: changes } }));
  };

  const updateStatus = (id: string, status: TicketStatus): void => {
    void runMutation(() => runUpdateTicket({ variables: { id, input: { status } } }));
  };

  // Drag sends an explicit rank (computed by the caller via getRankForIndex/getRankForEnd) so the
  // board can apply it optimistically and stay smooth while the mutation is in flight.
  const moveTicket = (id: string, status: TicketStatus, rank: string): void => {
    const current = tickets.find((ticket) => ticket.id === id);
    void runMutation(() =>
      runUpdateTicket({
        variables: { id, input: { status, rank } },
        optimisticResponse: current ? { updateTicket: { ...current, status, rank } } : undefined,
      }),
    );
  };

  const deleteTicket = (id: string): void => {
    void runMutation(() =>
      runDeleteTicket({
        variables: { id },
        update: (cache) => {
          // Evicting the entity alone leaves a dangling ref in TICKETS_QUERY's `tickets` array — strip it too.
          cache.modify({
            fields: {
              tickets(existing: readonly Reference[] = [], { readField }) {
                return existing.filter((ref) => readField('id', ref) !== id);
              },
            },
          });
          cache.evict({ id: cache.identify({ __typename: 'Ticket', id }) });
          cache.gc();
        },
      }),
    );
  };

  return { tickets, loading, error, createTicket, updateTicket, updateStatus, moveTicket, deleteTicket };
}
