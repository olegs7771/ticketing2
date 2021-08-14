import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

//Tell TS that there a property signin on global
declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

//Tell Jest to use mock file . Because Jest can not connect to cluster
// So we create fake client to get as param in abstract class Publisher in @olegs777/common
jest.mock('../nats-wrapper.ts');

//Hook function will run before all tests start to exectute
let mongo: any;
beforeAll(async () => {
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

//Hook will run before each of our tests
beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// After we finish running all different tests we should stop this
// MongoMemoryServer() server
// And disconnect mongoose.connect

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// Setting global signin function only available in test environment
// We can not  use signin from auth server because we want to completely isolated services
// So we will build fake authorized user with cookie
// 1) In browser signup new user
// 2) Look up response header
// 3) express:sess=eyJqd3QiOiJleUpoYkdja......
// 4) eyJqd3QiOiJleUpoYkdja...... is encoded in base64decode
// 5) open in base64decode.org
// 6) decode to JSON data
// 7) {"jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6I...
// 8) we have original jwt --> eyJhbGciOiJIUzI1NiIsInR5cCI6I...

global.signin = () => {
  // 1) Build a JWT payload .{id,email}
  // create random id for tesing in update.test.ts for testing if
  // ticket belongs to the same user
  const id = mongoose.Types.ObjectId().toHexString();
  const payload = {
    id,
    email: 'test@test.com',
  };
  // console.log('process.env.JWT_KEY!!!!', process.env.JWT_KEY);

  // 2) Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // 3) Build session Object. { jwt:MY_JWT}
  const session = { jwt: token };

  // 4) Turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // 5) Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // 6) return a string thats the cookie with the encoded data
  // express:sess=eyJqd3QiOiJleUpoYkdja......
  return [`express:sess=${base64}`];
};
