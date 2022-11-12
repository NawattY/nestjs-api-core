import { IsNotEmpty, IsNumber } from 'class-validator';
import { i18nValidationMessage as t } from 'nestjs-i18n';

export class AccessMerchantDto {
  @IsNotEmpty({
    message: t('validation.access_merchant_merchant_id_required'),
  })
  @IsNumber(
    { allowNaN: false },
    {
      message: t('validation.access_merchant_merchant_id_is_number'),
    },
  )
  merchantId: number;
}
