import { CustomError } from './custom-error';
import { ValidationError } from 'express-validator';

export class RequestValidationError extends CustomError {
  statusCode = 400;
  //equal to:
  // errors: ValidationError[]
  constructor(public errors: ValidationError[]) {
    // this.errors=errors
    super('Invalid request parameters');

    //Only because we are extends a build in class in TypeScript
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}

// throw new RequestValidationError(errors);
