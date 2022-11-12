import { IsEmail, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { i18nValidationMessage as t } from 'nestjs-i18n';

export class PasswordResetRequestDto {
  @Transform(({ value }) => value.toLowerCase())
  @IsNotEmpty({ message: t('validation.password_reset_email_not_empty') })
  @IsEmail({}, { message: t('validation.password_reset_email_invalid') })
  email: string;
}
