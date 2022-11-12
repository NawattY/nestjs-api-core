import { ErrorResponseInterface } from '@exceptions/exception.filter';
import { getTranslate } from '@helpers/get-translate.helper';
import { HttpStatus } from '@nestjs/common';
import { get } from 'lodash';
import {
  ApiResource,
  SuccessResponseInterface,
} from 'src/app/http/resources/api.resource';
import { getUrlImage } from '@helpers/thumbnail.helper';

export class BranchProductResource extends ApiResource {
  static successResponse(data: any): SuccessResponseInterface {
    if (!data) {
      return { status: { code: HttpStatus.OK, message: 'OK' } };
    }

    if (data.items) {
      const { items, links, meta } = data;

      const mapItems = items.map((item: any) => {
        return this.mapResponse(item);
      });

      return {
        data: mapItems,
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
    const image = get(item, 'image');

    return {
      id: +item.id,
      title: getTranslate(get(item, 'title')),
      titleTranslation: get(item, 'title'),
      detail: getTranslate(get(item, 'detail')),
      detailTranslation: get(item, 'detail'),
      image: getUrlImage(image),
      category: {
        id: item.category_id,
        title: getTranslate(item.category_title),
        titleTranslation: item.category_title,
        isActive: item.category_branch_is_active,
      },
      isActive: item.status,
      isOutOfStock: item.out_of_stock,
      isRecommend: item.is_recommend,
      normalPrice: parseFloat(item.normal_price),
      specialPrice: parseFloat(item.special_price),
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };
  }
}
