import { BranchEntity } from '@entities/tenant/branch.entity';
import { ErrorResponseInterface } from '@exceptions/exception.filter';
import { getTranslate } from '@helpers/get-translate.helper';
import { HttpStatus } from '@nestjs/common';
import { get } from 'lodash';
import {
  ApiResource,
  SuccessResponseInterface,
} from 'src/app/http/resources/api.resource';

export class BranchResource extends ApiResource {
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
    new BranchEntity([
      (response.id = +response.id),
      (response.titleTranslation = get(response, 'title')),
      (response.title = getTranslate(get(response, 'title'))),
      (response.detail = get(response, 'detail', null)),
      (response.phone = get(response, 'phone', null)),
    ]);

    delete response.deletedAt;

    return response;
  }
}
