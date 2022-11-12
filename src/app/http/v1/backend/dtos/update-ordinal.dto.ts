import { IsNotEmpty, Validate } from 'class-validator';
import { i18nValidationMessage as t } from 'nestjs-i18n';
import { OrdinalValidator } from 'src/app/common/validators/ordinal.validator';

export class UpdateOrdinalDto {
  @IsNotEmpty({
    each: true,
    message: t('validation.update_ordinal_required'),
  })
  @Validate(OrdinalValidator)
  ordinal: string[];
}
