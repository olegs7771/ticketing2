import {
  Publisher,
  Subjects,
  TicketCreateEvent,
} from '@olegs777tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreateEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

