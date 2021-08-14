import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@olegs777tickets/common';
import { natsWrapper } from '../../nats-wrapper';
import { TicketCreatedPublisher } from './ticket-created-publisher';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

//Making use of this class 

// new TicketCreatedPublisher(natsWrapper.client).publish({
  
// })