import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ errors: err.serializeErrors() });
  }
  // Log error that not custom error
  console.error('not custom error', err);

  res.status(400).send({ errors: [{ message: 'Something went wrong' }] });
};

//Common Response Structure
// {
//   errors:{
//     message:string,field?:string
//   }[]
// }
