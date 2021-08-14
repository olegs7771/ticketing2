// This middleware coming only after currentUser middleware!

import { NotAuthorizedError } from '../errors/not-authorized-error';
import { Request, Response, NextFunction } from 'express';
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    throw new NotAuthorizedError();
  }
  next();
};
