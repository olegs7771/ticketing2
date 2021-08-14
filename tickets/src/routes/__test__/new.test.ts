import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

//1) TEST
it('has a handler listening to /api/tickets for post request', async () => {
  const res = await request(app).post('/api/tickets').send({});
  expect(res.status).not.toEqual(404);
});
// 2) TEST
it('can only be accessed if user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

// 3) TEST
// in /test/setup we create global cookie session

it('returns status other then 401 if user signed in', async () => {
  const res = await request(app)
    .post('/api/tickets/')
    .set('Cookie', global.signin())
    .send({});
  // console.log('res.status', res.status);

  expect(res.status).not.toEqual(401);
});

// 4) TEST
it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

// 5) TEST
it('returns an error if an ivalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'some title',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'some title',
    })
    .expect(400);
});

// 6) TEST
it('creates a ticket with a valid inputs', async () => {
  // add in a check to make sure a ticket was created
  let tickets = await Ticket.find({});
  // After every test we delete all tickets in DB
  // in /test/setup.ts line 29
  // so we expect 0 documents
  expect(tickets.length).toEqual(0);
  // console.log('tickets before test', tickets);

  const title = 'some title';
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);
  tickets = await Ticket.find({});

  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
});

it('publishes an event', async () => {
  const title = 'some title';
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);
  // console.log('natsWrapper', natsWrapper);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
