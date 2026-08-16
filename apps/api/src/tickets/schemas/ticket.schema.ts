import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Ticket {
  @Prop({ required: true })
  title!: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  status!: string;

  @Prop({ required: true })
  priority!: number;

  @Prop()
  assigneeId?: string;

  @Prop({ required: true })
  rank!: string;

  createdAt!: Date;
}

export type TicketDocument = HydratedDocument<Ticket>;

export const TicketSchema = SchemaFactory.createForClass(Ticket);
