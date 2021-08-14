//Testing listener by creating fake data ,msg and it will create object in db.
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketCreateEvent } from '@olegs777tickets/common';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // 1) create the instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // 2) create a fake data event object
  const data: TicketCreateEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // 3) create a fake data message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();
  // 4) call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { data, listener, msg } = await setup();
  // 4) call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  // 5) write assertion to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
