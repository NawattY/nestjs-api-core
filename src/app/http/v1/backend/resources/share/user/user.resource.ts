import { UserEntity } from '@entities/default/user.entity';
import { ErrorResponseInterface } from '@exceptions/exception.filter';
import { HttpStatus } from '@nestjs/common';
import { get } from 'lodash';
import {
  ApiResource,
  SuccessResponseInterface,
} from 'src/app/http/resources/api.resource';
import { getUrlImage } from '@helpers/thumbnail.helper';
import { getTranslate } from '@helpers/get-translate.helper';

export class UserResource extends ApiResource {
  static successResponse(data: any): SuccessResponseInterface {
    if (data === undefined) {
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
    const profileImage = get(response, 'profileImage');
    let branches = Object();
    branches = [{ title: { th: 'ทุกสาขา', en: 'All Branches' } }];
    const merchant = response?.merchant;
    const logoImage = getUrlImage(get(merchant?.settings, 'logoImage'));

    new UserEntity([
      (response.id = +response.id),
      (response.merchantId = +response.merchantId),
      (response.profileImage = getUrlImage(profileImage)),
      (response.role = { title: 'Owner' }),
      (response.branches = branches.map((branch) => {
        branch.title = getTranslate(get(branch, 'title'));
        return branch;
      })),
      merchant ? (merchant.id = +merchant.id) : '',
      merchant ? (merchant.titleTranslation = get(merchant, 'title')) : '',
      merchant ? (merchant.title = getTranslate(get(merchant, 'title'))) : '',
      merchant ? (merchant.settings.logoImage = logoImage) : '',
    ]);

    delete response.password;
    delete response.createdAt;
    delete response.updatedAt;
    delete response.deletedAt;

    return response;
  }
}
