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

  // bug: same union-reflection crash — bare @Field() on TicketStatus fails schema build (design:type is Object, not String). Needs @Field(() => String).
  @Field()
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
