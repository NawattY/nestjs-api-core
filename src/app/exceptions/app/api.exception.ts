import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../constants/error-codes.constant';
import { HttpExceptionResponseInterface } from '@exceptions/exception.filter';

export class ApiException extends HttpException {
  constructor(
    errorCode: number,
    errors: string[] = [],
    status: number = HttpStatus.UNPROCESSABLE_ENTITY,
  ) {
    super(
      {
        errorCode,
        errorMessage: ErrorCodes[errorCode],
        errors,
      } as HttpExceptionResponseInterface,
      status,
    );
  }
}
