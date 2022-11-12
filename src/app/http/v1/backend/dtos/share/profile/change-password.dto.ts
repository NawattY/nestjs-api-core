import { Match } from 'src/app/common/validators/match.decorator';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';
import { i18nValidationMessage as t } from 'nestjs-i18n';

export class ChangePasswordDto {
  @IsNotEmpty({
    message: t('validation.change_password_old_password_not_empty'),
  })
  oldPassword: string;

  @IsNotEmpty({
    message: t('validation.change_password_password_not_empty'),
  })
  @MinLength(8, { message: t('validation.change_password_password_min') })
  @Matches(/^\S+$/, {
    message: t('validation.password_can_not_contain_space'),
  })
  @Match('passwordConfirm', { message: t('') })
  password: string;

  @IsNotEmpty({
    message: t('validation.change_password_password_confirm_not_empty'),
  })
  @Match('password', {
    message: t('validation.change_password_password_confirm_not_match'),
  })
  @MinLength(8, { message: t('') })
  passwordConfirm: string;
}
