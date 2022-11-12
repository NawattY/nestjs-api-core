import { MerchantEntity } from '@entities/default/merchant.entity';
import { ErrorResponseInterface } from '@exceptions/exception.filter';
import { getTranslate } from '@helpers/get-translate.helper';
import { HttpStatus } from '@nestjs/common';
import { get } from 'lodash';
import { getUrlImage } from '@helpers/thumbnail.helper';
import { SuccessResponseInterface } from 'src/app/http/resources/api.resource';

export class MerchantResource {
  static successResponse(data: any): SuccessResponseInterface {
    if (data === undefined) {
      return { status: { code: HttpStatus.OK, message: 'OK' } };
    }

    if (data.items) {
      const { items, links, meta } = data;

      items.map((item: any) => {
        if (item.settings) {
          item.settings = {
            locale: get(item.settings, 'locale', null),
            logoImage: getUrlImage(get(item.settings, 'logoImage')),
            primaryColor: get(item.settings, 'primaryColor', ''),
            secondaryColor: get(item.settings, 'secondaryColor', ''),
            textOnPrimaryColor: get(item.settings, 'textOnPrimaryColor', ''),
            backgroundColor: get(item.settings, 'backgroundColor', ''),
            supportLocales: get(item.settings, 'supportLocales', null),
          };
        }

        return this.mapResponse(item);
      });

      return {
        data: items,
        links,
        meta,
        status: { code: HttpStatus.OK, message: 'OK' },
      };
    } else {
      if (data.settings) {
        data.settings = {
          locale: get(data.settings, 'locale', null),
          logoImage: getUrlImage(get(data.settings, 'logoImage')),
          primaryColor: get(data.settings, 'primaryColor', ''),
          secondaryColor: get(data.settings, 'secondaryColor', ''),
          textOnPrimaryColor: get(data.settings, 'textOnPrimaryColor', ''),
          backgroundColor: get(data.settings, 'backgroundColor', ''),
          supportLocales: get(data.settings, 'supportLocales', null),
        };
      }

      const response = this.mapResponse(data);

      return { data: response, status: { code: HttpStatus.OK, message: 'OK' } };
    }
  }

  static errorResponse(error: Error): ErrorResponseInterface {
    throw error;
  }

  static mapResponse(response: any) {
    new MerchantEntity([
      (response.id = +response.id),
      (response.titleTranslation = get(response, 'title')),
      (response.title = get(response, 'title.th')),
      (response.descriptionTranslation = get(response, 'description')),
      (response.description = getTranslate(get(response, 'description'))),
    ]);

    delete response.deletedAt;

    return response;
  }
}
