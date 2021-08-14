import request from 'supertest';
import { app } from '../../app';

it('response with details about the current user', async () => {
const cookie= await global.signin();
    
    
const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie',cookie)
    .send()
    .expect(200);
  

  expect(response.body.user.email).toEqual('test@test.com')
 
});


//Test current user if not authenticated 
it('response with null if not authenticated',async()=>{
  const res = await request(app)
  .get('/api/users/currentuser')
  .send()
  .expect(200);
  expect(res.body.user).toEqual(null)
})