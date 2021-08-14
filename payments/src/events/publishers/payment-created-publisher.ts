import {
  Subjects,
  Publisher,
  PaymentCreateEvent,
} from '@olegs777tickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreateEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
