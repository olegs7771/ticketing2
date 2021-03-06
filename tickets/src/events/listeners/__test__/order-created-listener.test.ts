import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { OrderCreatedEvent, OrderStatus } from '@olegs777tickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // 1) Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // 2) Create and save ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'adafa',
  });
  await ticket.save();

  // 3) Create fake data object of incoming event
  // must satisfy OrderCreatedEvent interface

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asdfg',
    expiredAt: 'agaga',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // Create message
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, data, msg };
};

it('sets the useId of ticket', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  //ticket might be outdated so we must refetch the Ticket
  const updatedTicket = await Ticket.findById(ticket.id);
  console.log('updatedTicket', updatedTicket);
  console.log('data', data);

  // expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

// Remember that in test we use mock natsWrapper from __mocks__
// hence we should test if publish function been called
it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  //@ts-ignore
  // To show arguments been provided to publish function
  // console.log(natsWrapper.client.publish.mock.calls[0][1]);
  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1],
  );

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
