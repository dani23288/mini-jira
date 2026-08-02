import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import type { ICreateTicketInput, TicketPriority, TicketStatus } from '@org/types';
import { TICKET_PRIORITIES, TICKET_STATUSES } from '@org/consts';

@InputType('CreateTicketInput')
export class CreateTicketInput implements ICreateTicketInput {
  @Field()
  @IsString()
  @MinLength(1)
  title!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsIn(TICKET_PRIORITIES.map((option) => option.value))
  priority?: TicketPriority;

  // bug: bare @Field() can't reflect a TS string-literal union — design:type comes back Object, GraphQL schema build throws "Undefined type error" on boot. Needs @Field(() => String).
  @Field({ nullable: true })
  @IsOptional()
  @IsIn(TICKET_STATUSES.map((option) => option.value))
  status?: TicketStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  assigneeId?: string;
}
