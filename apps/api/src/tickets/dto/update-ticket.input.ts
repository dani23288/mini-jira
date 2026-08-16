import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import type { IUpdateTicketInput, TicketPriority, TicketStatus } from '@org/types';
import { TICKET_PRIORITY_VALUES, TICKET_STATUS_VALUES } from '@org/consts';

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
  @IsIn(TICKET_PRIORITY_VALUES)
  priority?: TicketPriority;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsIn(TICKET_STATUS_VALUES)
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
