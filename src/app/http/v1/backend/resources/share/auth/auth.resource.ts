import { ErrorResponseInterface } from '@exceptions/exception.filter';
import {
  ApiResource,
  SuccessResponseInterface,
} from 'src/app/http/resources/api.resource';

export class AuthResource extends ApiResource {
  static successResponse(data: any): SuccessResponseInterface {
    return super.successResponse(data);
  }

  static errorResponse(error: Error): ErrorResponseInterface {
    throw error;
  }
}
