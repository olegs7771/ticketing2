import { Listener } from './base-listener';
import { Message } from 'node-nats-streaming';
import { TicketCreateEvent } from './ticket-created-events';
import { Subjects } from './subjects';

export class TicketCreateListener extends Listener<TicketCreateEvent> {
  //channel to which publisher publish information

  // ensure that we not assign to subject different property
  //  this.subject = Subjects.OrderUpdated
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreateEvent['data'], msg: Message) {
    console.log('Event data!', data);

    //If everything works correctly aknowledge
    msg.ack();

    //If service  listener discconnected
  }
}
