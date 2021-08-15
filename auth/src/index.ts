import mongoose from 'mongoose';
import { app } from './app';

//MONGO CONNECTION
const start = async () => {
  console.log('Strating up...!!!!');

  //predefine process.env.JWT_KEY for typescipt
  if (!process.env.JWT_KEY) {
    throw new Error('JWT must be defined');
  }
  if (!process.env.MONGO_URI_AUTH) {
    throw new Error('MONGO_URI must be  defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI_AUTH, {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log('Connected to mongoDB');
  } catch (error) {
    console.log('error to connect to mongoDB');
  }
  app.listen(3000, () => {
    console.log('auth on port!!! 3000');
  });
};

start();
