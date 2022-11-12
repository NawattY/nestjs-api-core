import { IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { i18nValidationMessage as t } from 'nestjs-i18n';

export class MerchantUpdateDto {
  @IsNotEmpty({ message: t('validation.merchant_update_title_required') })
  title: string;

  @IsOptional()
  name: string;

  @Transform(({ value }) => value.toLowerCase())
  @IsOptional()
  email: string;

  @IsNotEmpty({ message: t('validation.merchant_update_domain_required') })
  domain: string;
}
