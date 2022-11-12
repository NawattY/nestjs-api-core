import { ErrorResponseInterface } from '@exceptions/exception.filter';
import { getTranslate } from '@helpers/get-translate.helper';
import { HttpStatus } from '@nestjs/common';
import { get } from 'lodash';
import {
  ApiResource,
  SuccessResponseInterface,
} from 'src/app/http/resources/api.resource';
import { getUrlImage } from '@helpers/thumbnail.helper';

export class ProductResource extends ApiResource {
  static successResponse(data: any): SuccessResponseInterface {
    if (!data) {
      return { status: { code: HttpStatus.OK, message: 'OK' } };
    }

    if (data.items) {
      const { items, links, meta } = data;

      const mapData = items.map((item: any) => {
        return this.mapResponse(item);
      });

      return {
        data: mapData,
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
    return {
      id: +response.id,
      title: getTranslate(get(response, 'title')),
      detail: getTranslate(get(response, 'detail')),
      image: getUrlImage(get(response, 'image')),
      normalPrice: response.normalPrice,
      specialPrice: response.specialPrice,
      isOutOfStock:
        get(response, 'branchInactiveProducts.0.outOfStock') === 1 ? 1 : 0,
    };
  }
}
