import { ErrorResponseInterface } from '@exceptions/exception.filter';
import { getTranslate } from '@helpers/get-translate.helper';
import { HttpStatus } from '@nestjs/common';
import { get } from 'lodash';
import {
  ApiResource,
  SuccessResponseInterface,
} from 'src/app/http/resources/api.resource';
import { getUrlImage } from '@helpers/thumbnail.helper';

export class ProductCategoryResource extends ApiResource {
  static successResponse(data: any): SuccessResponseInterface {
    if (!data) {
      return { status: { code: HttpStatus.OK, message: 'OK' } };
    }

    const mapData = data.map((item: any) => {
      return this.mapResponse(item);
    });

    return { data: mapData, status: { code: HttpStatus.OK, message: 'OK' } };
  }

  static errorResponse(error: Error): ErrorResponseInterface {
    throw error;
  }

  static mapResponse(item: any) {
    const response = {
      id: +item.id,
      title:
        item.id === 0 ? get(item, 'title') : getTranslate(get(item, 'title')),
    };

    let productResource = [];

    if (get(item, 'products')) {
      productResource = item.products.map((item: any) => {
        const product = {
          id: +item.products_id,
          title: getTranslate(get(item, 'products_title')),
          detail: getTranslate(get(item, 'products_detail')),
          image: getUrlImage(get(item, 'products_image')),
          normalPrice: item.products_normal_price,
          specialPrice: item.products_special_price,
          isOutOfStock:
            get(item, 'branchInactiveProducts_out_of_stock') === 1 ? 1 : 0,
        };

        return product;
      });

      Object.assign(response, {
        products: productResource,
      });
    }

    return response;
  }
}
