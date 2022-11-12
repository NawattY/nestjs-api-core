import { IsEmail, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { i18nValidationMessage as t } from 'nestjs-i18n';

export class AuthLoginDto {
  @Transform(({ value }) => value.toLowerCase())
  @IsNotEmpty({ message: t('validation.auth_login_email_not_empty') })
  @IsEmail({}, { message: t('validation.auth_login_email_invalid') })
  email: string;

  @IsNotEmpty({ message: t('validation.auth_login_password_not_empty') })
  password: string;
}
