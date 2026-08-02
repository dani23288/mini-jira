import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { ICreateTicketInput, ITicket, TicketPriority, TicketStatus } from '@org/types';
import { DEFAULT_TICKET_PRIORITY, DEFAULT_TICKET_STATUS } from '@org/consts';
import { getRankForEnd } from '@org/utils';
import { Ticket, TicketDocument } from './schemas/ticket.schema';
import { toTicket } from './tickets.mapper';
import type { SortDirection, TicketSortField } from './dto/tickets.args';

export interface TicketsFilter {
  status?: TicketStatus;
  priority?: TicketPriority;
  assigneeId?: string;
  search?: string;
  sort?: TicketSortField;
  dir?: SortDirection;
}

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

@Injectable()
export class TicketsService {
  constructor(@InjectModel(Ticket.name) private readonly ticketModel: Model<TicketDocument>) {}

  async find(filter: TicketsFilter): Promise<ITicket[]> {
    const query: Record<string, unknown> = {};
    if (filter.status) {
      query.status = filter.status;
    }
    if (filter.priority) {
      query.priority = filter.priority;
    }
    if (filter.assigneeId) {
      query.assigneeId = filter.assigneeId;
    }
    if (filter.search) {
      query.title = { $regex: filter.search, $options: 'i' };
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
      title: input.title,
      description: input.description,
      status,
      priority: input.priority ?? DEFAULT_TICKET_PRIORITY,
      assigneeId: input.assigneeId,
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

  private async getEndOfColumnRank(status: TicketStatus): Promise<string> {
    const docs = await this.ticketModel.find({ status }, { rank: 1 }).exec();
    const ranks = sortRanksAscending(docs.map((doc) => doc.rank));
    return getRankForEnd(ranks);
  }
}
