import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';

import { Password } from '../services/password';
import { User } from '../models/user';

import { validateRequest, BadRequestError } from '@olegs777tickets/common';

import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('invalid format'),
    body('password').trim().notEmpty().withMessage('You must apply password'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError('Invalid Credentials');
    }

    const passwordMatch = await Password.compare(user.password, password);

    if (!passwordMatch) {
      throw new BadRequestError('Inavlid Credentials');
    }
    //Generate jwt
    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!,
      // 'asdf',
    );
    //Store it on session object
    req.session = {
      jwt: userJwt,
    };
    // console.log('jwt stored', req.session.jwt);

    res.status(200).json(user);
  },
);

export { router as signinRouter };
