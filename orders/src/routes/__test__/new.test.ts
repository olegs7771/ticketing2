import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

//Using mock natsWrapper only for tasting purpose
import { natsWrapper } from '../../nats-wrapper';

// 1) Test
it('returns 401 not authotorized', async () => {
  const res = await request(app).post('/api/orders').send({});
  expect(res.status).toEqual(401);
});

it('returns 201 if authorized', async () => {
  const res = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({});
  expect(res.status).not.toEqual(401);
});

it('returns an error if the ticket does not exist', async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404);
});
it('returns an error if the ticket already reserved', async () => {
  // Create ticket
  const ticket = Ticket.build({
    title: 'theater',
    price: 50,
  });
  await ticket.save();

  //create order with associated ticket
  const order = Order.build({
    ticket,
    userId: 'ahgdhdjhs',
    status: OrderStatus.Created,
    expiredAt: new Date(), //we not expire the order by this date only by status
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it('reserved a ticket', async () => {
  //Create ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 40,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('Test publishing order created event', async () => {
  //Create ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 40,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
