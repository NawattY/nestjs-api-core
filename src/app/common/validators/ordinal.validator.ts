import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { get, isArray } from 'lodash';
import { i18nValidationMessage as t } from 'nestjs-i18n';

@ValidatorConstraint({ name: 'ordinalValidator', async: true })
@Injectable()
export class OrdinalValidator implements ValidatorConstraintInterface {
  async validate(values: string[]) {
    let countValue = 0;

    if (isArray(values) && values?.length) {
      values.forEach((value) => {
        const id = parseInt(get(value, 'id'));
        const ordinal = parseInt(get(value, 'ordinal'));

        if (id && ordinal >= 0) {
          countValue++;
        }
      });

      if (countValue === values.length) {
        return true;
      }

      return false;
    }

    return false;
  }

  defaultMessage(): any {
    return t('validation.update_ordinal_invalid');
  }
}
