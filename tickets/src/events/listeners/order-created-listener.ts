import { Listener, OrderCreatedEvent, Subjects } from '@olegs777tickets/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // 1) Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // 2) If no ticket throw console.error;
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    // 3) Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });
    // 4) Save the ticket
    await ticket.save();

    //Create Publisher to send event to order service of updating ticket
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    // 5) ack the message
    msg.ack();
  }
}
