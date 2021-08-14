import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not found', async () => {
  //Create valid id using mongoose
  const id = new mongoose.Types.ObjectId().toHexString();

  const res = await request(app)
    .get(`/api/tickets/${id}`)

    .expect(404);
});

it('returns a 200 and ticket if the ticket is found', async () => {
  // we will create new ticket on the fly and try to find it

  const title = 'concert';
  const price = 20;
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201);
  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()
    .expect(200);
  expect(ticketRes.body.title).toEqual(title);
  expect(ticketRes.body.price).toEqual(price);
});
