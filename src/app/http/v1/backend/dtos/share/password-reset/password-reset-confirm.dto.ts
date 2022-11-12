import { Match } from 'src/app/common/validators/match.decorator';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';
import { i18nValidationMessage as t } from 'nestjs-i18n';

export class PasswordResetConfirmDto {
  @IsNotEmpty({
    message: t('validation.password_reset_confirm_token_not_empty'),
  })
  token: string;

  @IsNotEmpty({
    message: t('validation.password_reset_confirm_password_not_empty'),
  })
  @MinLength(8, {
    message: t('validation.password_reset_confirm_password_min'),
  })
  @Match('passwordConfirm', { message: t('') })
  @Matches(/^\S+$/, {
    message: t('validation.password_can_not_contain_space'),
  })
  password: string;

  @IsNotEmpty({
    message: t('validation.password_reset_confirm_password_confirm_not_empty'),
  })
  @Match('password', {
    message: t('validation.password_reset_confirm_password_confirm_not_match'),
  })
  @MinLength(8, { message: t('') })
  passwordConfirm: string;
}
