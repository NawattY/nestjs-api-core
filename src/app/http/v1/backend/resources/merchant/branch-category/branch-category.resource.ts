import { ErrorResponseInterface } from '@exceptions/exception.filter';
import { getTranslate } from '@helpers/get-translate.helper';
import { HttpStatus } from '@nestjs/common';
import { get } from 'lodash';
import {
  ApiResource,
  SuccessResponseInterface,
} from 'src/app/http/resources/api.resource';

export class BranchCategoryResource extends ApiResource {
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

  static mapResponse(item: any) {
    const response = {
      id: +get(item, 'id') || +get(item, 'categories_id'),
      titleTranslation: get(item, 'title') || get(item, 'categories_title'),
      title:
        getTranslate(get(item, 'title')) ||
        getTranslate(get(item, 'categories_title')),
      isActive: get(item, 'inactive_category_id') ? 0 : 1,
      ordinal: get(item, 'ordinal') || get(item, 'categories_ordinal'),
      createdAt: get(item, 'createdAt') || get(item, 'categories_created_at'),
      updatedAt: get(item, 'updatedAt') || get(item, 'categories_updated_at'),
    };

    const products = get(item, 'productcount');
    if (products) {
      Object.assign(response, {
        productCount: +get(item, 'productcount', 0),
      });
    }

    return response;
  }
}
