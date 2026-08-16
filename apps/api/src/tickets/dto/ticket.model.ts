import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import type { ITicket, TicketPriority, TicketStatus } from '@org/types';

@ObjectType('Ticket')
export class TicketModel implements ITicket {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => String)
  status!: TicketStatus;

  @Field(() => Int)
  priority!: TicketPriority;

  @Field({ nullable: true })
  assigneeId?: string;

  @Field()
  rank!: string;

  @Field()
  createdAt!: string;
}
