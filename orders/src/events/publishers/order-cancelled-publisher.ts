import {
  Subjects,
  Publisher,
  OrderCancelledEvent,
} from '@olegs777tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
