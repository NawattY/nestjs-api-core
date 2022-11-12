import { ValidationError } from '@nestjs/common';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';

export class I18nValidation extends I18nValidationExceptionFilter {
  flattenValidationErrors(validationErrors: ValidationError[]): any {
    return validationErrors.map((value) => {
      return {
        [value?.property]: Object.entries(value.constraints).map(
          (contain) => contain[1],
        ),
      };
    });
  }
}
