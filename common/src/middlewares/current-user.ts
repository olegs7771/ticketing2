import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

//create interface for not existing yet req.user property
interface UserDecoded {
  id: string;
  email: string;
}

// Reach into existing type and make modifications
declare global {
  namespace Express {
    interface Request {
      user?: UserDecoded;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // first we check req.session then check req.session.jwt
  // ? sign equal to req.session||req.session.jwt

  if (!req.session?.jwt) {
    //if no jwt in req.session then move to next middleware
    return next();
  }

  try {
    const decoded = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!,
    ) as UserDecoded;
    req.user = decoded;
  } catch (error) {}
  next();
};
