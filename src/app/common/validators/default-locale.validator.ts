import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { get } from 'lodash';
import { i18nValidationMessage as t } from 'nestjs-i18n';

@ValidatorConstraint({ name: 'defaultLocaleValidator', async: true })
@Injectable()
export class DefaultLocaleValidator implements ValidatorConstraintInterface {
  async validate(value: string[]) {
    if (get(value, process.env.MERCHANT_DEFAULT_LOCALE)) {
      return true;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments): any {
    const { property } = args;

    return t(
      `validation.common_${property}_${process.env.MERCHANT_DEFAULT_LOCALE}_required`,
    );
  }
}
