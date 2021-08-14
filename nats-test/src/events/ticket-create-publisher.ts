import { Publisher } from './base-publisher';
import { TicketCreateEvent } from './ticket-created-events';
import { Subjects } from './subjects';

// class Publisher is generic class its mean we must provide type argument

export class TicketCreatedPublisher extends Publisher<TicketCreateEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
