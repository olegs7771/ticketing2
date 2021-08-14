import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from '@olegs777tickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  
}
