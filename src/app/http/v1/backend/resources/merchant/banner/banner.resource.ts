import { BannerEntity } from '@entities/tenant/banner.entity';
import { ErrorResponseInterface } from '@exceptions/exception.filter';
import { HttpStatus } from '@nestjs/common';
import { get } from 'lodash';
import {
  ApiResource,
  SuccessResponseInterface,
} from 'src/app/http/resources/api.resource';
import { getUrlImage } from '@helpers/thumbnail.helper';

export class BannerResource extends ApiResource {
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

    new BannerEntity([
      (response.id = +response.id),
      (response.image = getUrlImage(image)),
    ]);

    delete response.deletedAt;

    return response;
  }
}
