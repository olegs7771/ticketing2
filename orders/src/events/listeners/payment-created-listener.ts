import {
  Subjects,
  Listener,
  PaymentCreateEvent,
  OrderStatus,
} from '@olegs777tickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreateEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: PaymentCreateEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error('order not found');
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();
    msg.ack()
  }
}
