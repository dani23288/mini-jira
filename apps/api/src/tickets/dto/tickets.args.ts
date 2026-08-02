import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsIn, IsOptional, IsString } from 'class-validator';
import type { TicketPriority, TicketStatus } from '@org/types';
import { TICKET_PRIORITIES, TICKET_STATUSES } from '@org/consts';

export const TICKET_SORT_FIELDS = ['rank', 'priority', 'createdAt'] as const;
export type TicketSortField = (typeof TICKET_SORT_FIELDS)[number];

export const SORT_DIRECTIONS = ['asc', 'desc'] as const;
export type SortDirection = (typeof SORT_DIRECTIONS)[number];

@ArgsType()
export class TicketsArgs {
  // bug: same union-reflection crash — bare @Field() on TicketStatus fails schema build. Needs @Field(() => String). Confirmed by actually booting GraphQLSchemaFactory: throws on this field first.
  @Field({ nullable: true })
  @IsOptional()
  @IsIn(TICKET_STATUSES.map((option) => option.value))
  status?: TicketStatus;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsIn(TICKET_PRIORITIES.map((option) => option.value))
  priority?: TicketPriority;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  assigneeId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  // bug: same union-reflection crash — TicketSortField is a string-literal union, bare @Field() fails schema build. Needs @Field(() => String).
  @Field({ nullable: true })
  @IsOptional()
  @IsIn(TICKET_SORT_FIELDS)
  sort?: TicketSortField;

  // bug: same union-reflection crash — SortDirection is a string-literal union, bare @Field() fails schema build. Needs @Field(() => String).
  @Field({ nullable: true })
  @IsOptional()
  @IsIn(SORT_DIRECTIONS)
  dir?: SortDirection;
}
