import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './schemas/ticket.schema';
import { TicketsResolver } from './tickets.resolver';
import { TicketsService } from './tickets.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }])],
  providers: [TicketsService, TicketsResolver],
})
export class TicketsModule {}
