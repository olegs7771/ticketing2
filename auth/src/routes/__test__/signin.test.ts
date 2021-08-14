import request from 'supertest';
import { app } from '../../app';

//Test signin password && email fields
it('return 400 if email or password invalid', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: '',
      password: '12345',
    })
    .expect(400);
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '',
    })
    .expect(400);
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '1',
    })
    .expect(400);
});

//Test if user with such email exists on signin
it('fails when an email that does not exist been supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

//Test incorrect password supplied
it('fails when an incorect password is supplied', async () => {
  await request(app).post('/api/users/signin').send({
    email: 'test333@test.com',
    password: '1234',
  });
  expect(400);
});

//Test response with a cookie when received valid credentials
it('responds with a cookie in header', async () => {
  await request(app).post('/api/users/signup').send({
    email: 'test333@test.com',
    password: '1111',
  });
  expect(201);
  const response = await request(app).post('/api/users/signin').send({
    email: 'test333@test.com',
    password: '1111',
  });
  expect(200);
  expect(response.get('Set-Cookie')).toBeDefined();
});
