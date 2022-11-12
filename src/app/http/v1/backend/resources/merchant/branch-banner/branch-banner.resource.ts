import { ErrorResponseInterface } from '@exceptions/exception.filter';
import { HttpStatus } from '@nestjs/common';
import { get } from 'lodash';
import {
  ApiResource,
  SuccessResponseInterface,
} from 'src/app/http/resources/api.resource';
import { getUrlImage } from '@helpers/thumbnail.helper';

export class BranchBannerResource extends ApiResource {
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
    const image = get(item, 'image') || get(item, 'banners_image');

    const response = {
      id: +get(item, 'id') || +get(item, 'banners_id'),
      title: get(item, 'title') || get(item, 'banners_title'),
      link: get(item, 'link') || get(item, 'banners_link'),
      startDate: get(item, 'startDate') || get(item, 'banners_start_date'),
      endDate: get(item, 'endDate') || get(item, 'banners_end_date'),
      image: getUrlImage(image),
      ordinal: get(item, 'ordinal') || get(item, 'banners_ordinal'),
      isActive: get(item, 'inactive_banner_id') ? 0 : 1,
      createdAt: get(item, 'createdAt') || get(item, 'banners_created_at'),
      updatedAt: get(item, 'updatedAt') || get(item, 'banners_updated_at'),
    };

    return response;
  }
}
