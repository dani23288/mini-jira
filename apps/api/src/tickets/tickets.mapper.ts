import type { ITicket, TicketPriority, TicketStatus } from '@org/types';
import type { TicketDocument } from './schemas/ticket.schema';

export function toTicket(doc: TicketDocument): ITicket {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    status: doc.status as TicketStatus,
    priority: doc.priority as TicketPriority,
    assigneeId: doc.assigneeId,
    rank: doc.rank,
    createdAt: doc.createdAt.toISOString(),
  };
}
