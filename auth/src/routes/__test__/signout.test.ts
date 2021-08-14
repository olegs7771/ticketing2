import request from 'supertest';
import { app } from '../../app';
//Test signout user

it('on signout user return req.session null', async () => {
  await request(app).post('/api/users/signup').send({
    email: 'test333@test.com',
    password: '1111',
  });
  expect(201);

  await request(app).post('/api/users/signin').send({
    email: 'test333@test.com',
    password: '1111',
  });
  expect(200);

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);
  expect(response.get('Set-Cookie')).toEqual([
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly',
  ]);
});
