export abstract class CustomError extends Error {
  abstract statusCode: number;
  //in order to be able pass some message to new Error('some string')
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
