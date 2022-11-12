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

    let mapData = null;

    if (Array.isArray(data)) {
      mapData = data.map((item: any) => {
        return this.mapResponse(item);
      });
    } else {
      mapData = this.mapResponse(data);
    }

    return {
      data: mapData,
      status: { code: HttpStatus.OK, message: 'OK' },
    };
  }

  static errorResponse(error: Error): ErrorResponseInterface {
    throw error;
  }

  static mapResponse(item: any) {
    const image = get(item, 'image') || get(item, 'banners_image');

    const response = {
      id: +get(item, 'id') || +get(item, 'banners_id'),
      title: get(item, 'title') || get(item, 'banners_title'),
      link: get(item, 'link') || get(item, 'banners_link'),
      image: getUrlImage(image),
      startDate: get(item, 'startDate') || get(item, 'banners_start_date'),
      endDate: get(item, 'endDate') || get(item, 'banners_end_date'),
    };

    return response;
  }
}
