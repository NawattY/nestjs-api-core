import { ErrorResponseInterface } from '@exceptions/exception.filter';
import { HttpStatus } from '@nestjs/common';
import { get } from 'lodash';
import { getUrlImage } from '@helpers/thumbnail.helper';
import { SuccessResponseInterface } from 'src/app/http/resources/api.resource';

export class MerchantSettingResource {
  static successResponse(data: any): SuccessResponseInterface {
    if (!data) {
      return { status: { code: HttpStatus.OK, message: 'OK' } };
    }

    const response = (data = {
      locale: get(data, 'locale', null),
      logoImage: getUrlImage(get(data, 'logoImage')),
      primaryColor: get(data, 'primaryColor', ''),
      secondaryColor: get(data, 'secondaryColor', ''),
      textOnPrimaryColor: get(data, 'textOnPrimaryColor', ''),
      backgroundColor: get(data, 'backgroundColor', ''),
      supportLocales: get(data, 'supportLocales', null),
    });

    return { data: response, status: { code: HttpStatus.OK, message: 'OK' } };
  }

  static errorResponse(error: Error): ErrorResponseInterface {
    throw error;
  }
}
