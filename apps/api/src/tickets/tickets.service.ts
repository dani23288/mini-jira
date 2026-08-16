import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { ICreateTicketInput, ITicket, SortDirection, TicketPriority, TicketSortField, TicketStatus } from '@org/types';
import { DEFAULT_TICKET_PRIORITY, DEFAULT_TICKET_STATUS } from '@org/consts';
import { getRankForEnd } from '@org/utils';
import { Ticket, TicketDocument } from './schemas/ticket.schema';
import { toTicket } from './tickets.mapper';

export interface TicketsFilter {
  status?: TicketStatus;
  priority?: TicketPriority;
  assigneeId?: string;
  search?: string;
  sort?: TicketSortField;
  dir?: SortDirection;
}

// Equality filters: input field -> mongo field (same name today, but kept explicit so a
// renamed/derived mongo field doesn't have to fight this loop).
const EQUALITY_FILTER_FIELDS: { input: 'status' | 'priority' | 'assigneeId'; mongo: string }[] = [
  { input: 'status', mongo: 'status' },
  { input: 'priority', mongo: 'priority' },
  { input: 'assigneeId', mongo: 'assigneeId' },
];

export interface UpdateTicketData {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  status?: TicketStatus;
  assigneeId?: string;
  rank?: string;
}

// Codepoint order, not localeCompare — rank keys are opaque sort tokens, not user-facing text.
function sortRanksAscending(ranks: string[]): string[] {
  return ranks.slice().sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

// Neutralizes regex metacharacters in user input so search stays a literal substring match.
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export class TicketsService {
  constructor(@InjectModel(Ticket.name) private readonly ticketModel: Model<TicketDocument>) {}

  async find(filter: TicketsFilter): Promise<ITicket[]> {
    const query: Record<string, unknown> = {};
    for (const { input, mongo } of EQUALITY_FILTER_FIELDS) {
      if (filter[input]) {
        query[mongo] = filter[input];
      }
    }
    if (filter.search) {
      query.title = { $regex: escapeRegExp(filter.search), $options: 'i' };
    }

    const sortField = filter.sort ?? 'rank';
    const sortDirection = filter.dir === 'desc' ? -1 : 1;

    const docs = await this.ticketModel
      .find(query)
      .sort({ [sortField]: sortDirection })
      .exec();
    return docs.map(toTicket);
  }

  async create(input: ICreateTicketInput): Promise<ITicket> {
    const status = input.status ?? DEFAULT_TICKET_STATUS;
    const rank = await this.getEndOfColumnRank(status);
    const doc = await this.ticketModel.create({
      ...input,
      status,
      priority: input.priority ?? DEFAULT_TICKET_PRIORITY,
      rank,
    });
    return toTicket(doc);
  }

  async update(id: string, changes: UpdateTicketData): Promise<ITicket> {
    const existing = await this.ticketModel.findById(id).exec();
    if (!existing) {
      throw new NotFoundException(`Ticket ${id} not found`);
    }

    const statusChanged = changes.status !== undefined && changes.status !== existing.status;
    const rank = changes.rank ?? (statusChanged ? await this.getEndOfColumnRank(changes.status as TicketStatus) : existing.rank);

    existing.set({ ...changes, rank });
    const saved = await existing.save();
    return toTicket(saved);
  }

  async remove(id: string): Promise<void> {
    const result = await this.ticketModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Ticket ${id} not found`);
    }
  }

  // nit: read-then-write, no lock — two concurrent creates/status-changes into the same column can compute the same end rank and collide. Fine for single-user practice use, revisit with a unique (status, rank) index if concurrent writers show up.
  private async getEndOfColumnRank(status: TicketStatus): Promise<string> {
    const docs = await this.ticketModel.find({ status }, { rank: 1 }).exec();
    const ranks = sortRanksAscending(docs.map((doc) => doc.rank));
    return getRankForEnd(ranks);
  }
}
