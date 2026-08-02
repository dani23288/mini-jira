import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import type { IUpdateTicketInput, TicketPriority, TicketStatus } from '@org/types';
import { TICKET_PRIORITIES, TICKET_STATUSES } from '@org/consts';

@InputType('UpdateTicketInput')
export class UpdateTicketInput implements IUpdateTicketInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsIn(TICKET_PRIORITIES.map((option) => option.value))
  priority?: TicketPriority;

  // bug: same union-reflection crash as create-ticket.input.ts — bare @Field() on TicketStatus fails schema build. Needs @Field(() => String).
  @Field({ nullable: true })
  @IsOptional()
  @IsIn(TICKET_STATUSES.map((option) => option.value))
  status?: TicketStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  assigneeId?: string;

  // Rank ownership is split (see docs/phase-plan.md): drag sends this explicitly, create and
  // status-dropdown omit it so TicketsService computes end-of-column instead.
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  rank?: string;
}
