import { BannerLinkEnum } from '@enums/banner-link';
import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidationArguments } from 'class-validator';
import { isEmpty } from 'lodash';
import { i18nValidationMessage as t } from 'nestjs-i18n';

@ValidatorConstraint({ name: 'linkTypeValidator', async: true })
@Injectable()
export class LinkTypeValidator implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    const linkType = (args.object as any)['linkType'];

    if (!value && linkType !== BannerLinkEnum.NONE) {
      return !isEmpty(value);
    } else {
      if (linkType === BannerLinkEnum.PRODUCT) {
        return !isNaN(parseInt(value));
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): any {
    const value = (args.object as any)['linkTo'];
    const linkType = (args.object as any)['linkType'];

    if (!value) {
      return t(`validation.banner_${linkType}_required`);
    } else {
      if (linkType === BannerLinkEnum.PRODUCT && isNaN(parseInt(value))) {
        return t('validation.banner_product_is_number');
      }
    }
  }
}
