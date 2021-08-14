import { Listener, OrderCreatedEvent, Subjects } from '@olegs777tickets/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';

//Import queue for a job. When we received event order-create
// enqueue job for bull through REDIS

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    console.log('data orderCreatedEvent', data);

    const delay = new Date(data.expiredAt).getTime() - new Date().getTime();
    console.log('Waiting this many milliseconds to process the job', delay);

    //Create new job
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      },
    );
    msg.ack();
  }
}
