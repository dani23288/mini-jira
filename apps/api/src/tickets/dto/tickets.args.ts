import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsIn, IsOptional, IsString } from 'class-validator';
import type { SortDirection, TicketPriority, TicketSortField, TicketStatus } from '@org/types';
import { SORT_DIRECTIONS, TICKET_PRIORITY_VALUES, TICKET_SORT_FIELDS, TICKET_STATUS_VALUES } from '@org/consts';

@ArgsType()
export class TicketsArgs {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsIn(TICKET_STATUS_VALUES)
  status?: TicketStatus;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsIn(TICKET_PRIORITY_VALUES)
  priority?: TicketPriority;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  assigneeId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsIn(TICKET_SORT_FIELDS)
  sort?: TicketSortField;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsIn(SORT_DIRECTIONS)
  dir?: SortDirection;
}
