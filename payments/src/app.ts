import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import cookieSession from 'cookie-session';

import {
  NotFoundError,
  errorHandler,
  currentUser,
  requireAuth,
} from '@olegs777tickets/common';

import { createChargeRouter } from '../src/routes/new';

const app = express();
//traffic been proxied to our application trough ingress nginx
//express gonna see that the staff been proxied and by default
//express doesnt trust to https connection
app.set('trust proxy', true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test', //cookie can be accessed only in https Request
    // in supertest we only make http request hence no cookie showen in header. flip to false only for test issuie
  }),
);

//MIDDLEWARE coming from our own npm package
// app.post('*', (req, res, next) => {
//   console.log('res.headers in app', req.headers);
//   console.log('res.user in app', req.user);
//   next();
// });

app.use(currentUser);
app.use(createChargeRouter);

//CATCH ALL NOT FOUND ROUTES
app.all('*', async () => {
  console.log('route not found!!');
  throw new NotFoundError();
});

//ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

export { app };
