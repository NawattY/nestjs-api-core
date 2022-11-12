import { CategoryEntity } from '@entities/tenant/categories.entity';
import { ErrorResponseInterface } from '@exceptions/exception.filter';
import { getTranslate } from '@helpers/get-translate.helper';
import { isAppendOrInclude } from '@helpers/is-append-or-include.helper';
import { HttpStatus } from '@nestjs/common';
import { get } from 'lodash';
import {
  ApiResource,
  SuccessResponseInterface,
} from 'src/app/http/resources/api.resource';

export class CategoryResource extends ApiResource {
  static successResponse(
    data: any,
    parameters?: any,
  ): SuccessResponseInterface {
    if (!data) {
      return { status: { code: HttpStatus.OK, message: 'OK' } };
    }

    if (data.items) {
      const { items, links, meta } = data;

      items.map((item: any) => {
        return this.mapResponse(item, parameters);
      });

      return {
        data: items,
        links,
        meta,
        status: { code: HttpStatus.OK, message: 'OK' },
      };
    } else {
      const response = this.mapResponse(data, parameters);

      return { data: response, status: { code: HttpStatus.OK, message: 'OK' } };
    }
  }

  static errorResponse(error: Error): ErrorResponseInterface {
    throw error;
  }

  static mapResponse(response: any, parameters: any) {
    const newCategory = [
      (response.id = +get(response, 'id') || +get(response, 'categories_id')),
      (response.titleTranslation =
        get(response, 'title') || get(response, 'categories_title')),
      (response.title =
        getTranslate(get(response, 'title')) ||
        getTranslate(get(response, 'categories_title'))),
      (response.isActive =
        get(response, 'isActive') || get(response, 'categories_is_active')),
      (response.ordinal =
        get(response, 'ordinal') || get(response, 'categories_ordinal')),
      (response.createdAt =
        get(response, 'createdAt') || get(response, 'categories_created_at')),
      (response.updatedAt =
        get(response, 'updatedAt') || get(response, 'categories_updated_at')),
    ];

    if (isAppendOrInclude(parameters?.appends, 'productCount')) {
      const products = get(response, 'products');

      newCategory.push(
        (response.productCount = products
          ? products.length
          : +get(response, 'productcount', 0)),
      );
    }

    new CategoryEntity(newCategory);

    delete response.deletedAt;
    delete response.products;
    delete response.categories_id;
    delete response.categories_title;
    delete response.categories_is_active;
    delete response.categories_ordinal;
    delete response.categories_created_at;
    delete response.categories_updated_at;
    delete response.categories_deleted_at;
    delete response.productcount;

    return response;
  }
}
