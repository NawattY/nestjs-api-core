import { ProductEntity } from '@entities/tenant/products.entity';
import { ErrorResponseInterface } from '@exceptions/exception.filter';
import { getTranslate } from '@helpers/get-translate.helper';
import { HttpStatus } from '@nestjs/common';
import { get } from 'lodash';
import {
  ApiResource,
  SuccessResponseInterface,
} from 'src/app/http/resources/api.resource';
import { getUrlImage } from '@helpers/thumbnail.helper';
import { CategoryResource } from '../category/category.resource';

export class ProductResource extends ApiResource {
  static successResponse(data: any): SuccessResponseInterface {
    if (!data) {
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
    const image = get(response, 'image');
    const category = get(response, 'category');

    new ProductEntity([
      (response.id = +response.id),
      (response.titleTranslation = get(response, 'title')),
      (response.title = getTranslate(get(response, 'title'))),
      (response.detailTranslation = get(response, 'detail')),
      (response.detail = getTranslate(get(response, 'detail'))),
      (response.image = getUrlImage(image)),
      category
        ? (response.category = CategoryResource.successResponse(category).data)
        : '',
    ]);

    delete response.deletedAt;

    return response;
  }
}
