import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from '@olegs777tickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
