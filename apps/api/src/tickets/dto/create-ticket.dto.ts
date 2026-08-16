import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import type { ICreateTicketInput, TicketPriority, TicketStatus } from '@org/types';
import { TICKET_PRIORITY_VALUES, TICKET_STATUS_VALUES } from '@org/consts';

@InputType('CreateTicketInput')
export class CreateTicketDto implements ICreateTicketInput {
  @Field()
  @IsString()
  @MinLength(1)
  title!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  // TicketPriority is a literal-union type (1 | 2 | 3), not a runtime TS enum, so there's no
  // enum object for @IsEnum to check against. @Type (class-transformer) only casts/transforms
  // a value to a type — it doesn't validate membership. @IsIn checks the value is one of
  // TICKET_PRIORITY_VALUES, keeping validation in sync with the shared consts as the single
  // source of truth.
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
}
