import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage as t } from 'nestjs-i18n';

export class UpdateLocaleDto {
  @IsArray({ message: t('validation.merchant_update_support_locales_invalid') })
  @ArrayMinSize(1, {
    message: t('validation.merchant_update_support_locales_min'),
  })
  @IsNotEmpty({
    each: true,
    message: t('validation.merchant_update_support_locales_required'),
  })
  supportLocales: string[];

  @IsNotEmpty({
    message: t('validation.merchant_update_locale_required'),
  })
  locale: string;
}
