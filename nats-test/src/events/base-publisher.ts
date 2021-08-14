import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

// Exporting generic class  we want to enforce some type checking on all
// subclasses

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  private client: Stan; //private so none gonna messup with it
  constructor(client: Stan) {
    this.client = client;
  }

  // Publish as a promise

  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          reject(err);
        }
        console.log('Event published to subject!', this.subject);

        resolve();
        console.log('Event published.');
      });
    });
  }
}
