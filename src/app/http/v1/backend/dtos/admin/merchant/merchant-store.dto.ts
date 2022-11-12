import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { i18nValidationMessage as t } from 'nestjs-i18n';

export class MerchantStoreDto {
  @IsNotEmpty({ message: t('validation.merchant_create_title_required') })
  title: string;

  @IsOptional()
  description: string;

  @IsNotEmpty({ message: t('validation.merchant_create_domain_required') })
  domain: string;

  @IsNotEmpty({ message: t('validation.merchant_create_name_required') })
  name: string;

  @Transform(({ value }) => (value ? value.toLowerCase() : ''))
  @IsNotEmpty({ message: t('validation.merchant_create_email_required') })
  @IsEmail({}, { message: t('validation.merchant_create_email_invalid') })
  email: string;

  @IsNotEmpty({ message: t('validation.merchant_create_password_required') })
  @MinLength(8, { message: t('validation.merchant_create_password_min') })
  @Matches(/^\S+$/, {
    message: t('validation.password_can_not_contain_space'),
  })
  password: string;

  @IsOptional()
  @Matches(/^(?:)|(06|08|09)(\d{8})$/, {
    message: t('validation.merchant_create_mobile_invalid'),
  })
  mobile: string;

  @IsNotEmpty({ message: t('validation.merchant_create_connection_required') })
  connectionId: number;
}
