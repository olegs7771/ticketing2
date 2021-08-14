import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreateEvent } from '@olegs777tickets/common';

import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreateEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketCreateEvent['data'], msg: Message) {
    console.log('data', data);

    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();
    console.log('ticket created in orders', ticket);

    // tell NETS streaming service that we proccessed this event
    msg.ack();
  }
}
