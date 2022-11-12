import { ErrorResponseInterface } from '@exceptions/exception.filter';
import { HttpStatus } from '@nestjs/common';
import {
  ApiResource,
  SuccessResponseInterface,
} from 'src/app/http/resources/api.resource';

export class PasswordResetResource extends ApiResource {
  static successResponse(data: any): SuccessResponseInterface {
    if (data === undefined) {
      return { status: { code: HttpStatus.OK, message: 'OK' } };
    }

    if (data.items) {
      const { items, links, meta } = data;

      items.map((item: any) => {
        return this.mapResponse(item);
      });

      return {
        data: items,
        links,
        meta,
        status: { code: HttpStatus.OK, message: 'OK' },
      };
    } else {
      const response = this.mapResponse(data);

      return { data: response, status: { code: HttpStatus.OK, message: 'OK' } };
    }
  }

  static errorResponse(error: Error): ErrorResponseInterface {
    throw error;
  }

  static mapResponse(response: any) {
    delete response.id;
    delete response.userId;
    delete response.type;
    delete response.token;
    delete response.createdAt;
    delete response.updatedAt;

    return response;
  }
}
