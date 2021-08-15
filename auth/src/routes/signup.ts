import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';

import { validateRequest, BadRequestError } from '@olegs777tickets/common';
import jwt from 'jsonwebtoken';

const router = express.Router();
router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email not valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password between 4-20 chars'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new BadRequestError('Email already exists');
    }

    const newUser = await User.build({
      email,
      password,
    }).save();

    //Generate jwt
    const userJwt = jwt.sign(
      { id: newUser.id, email: newUser.email },
      // process.env.JWT_KEY!,
      'asdf',
    );
    //Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).json(newUser);
  },
);

export { router as signupRouter };
