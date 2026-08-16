import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketModel } from './dto/ticket.model';
import { TicketsArgs } from './dto/tickets.args';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { TicketsService } from './tickets.service';

@Resolver(() => TicketModel)
export class TicketsResolver {
  constructor(private readonly ticketsService: TicketsService) {}

  @Query(() => [TicketModel])
  tickets(@Args() args: TicketsArgs) {
    return this.ticketsService.find(args);
  }

  @Mutation(() => TicketModel)
  createTicket(@Args('input') input: CreateTicketDto) {
    return this.ticketsService.create(input);
  }

  @Mutation(() => TicketModel)
  updateTicket(@Args('id', { type: () => ID }) id: string, @Args('input') input: UpdateTicketInput) {
    return this.ticketsService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteTicket(@Args('id', { type: () => ID }) id: string) {
    await this.ticketsService.remove(id);
    return true;
  }
}
