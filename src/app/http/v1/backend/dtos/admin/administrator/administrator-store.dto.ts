import { Match } from 'src/app/common/validators/match.decorator';
import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { isNull } from 'lodash';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { i18nValidationMessage as t } from 'nestjs-i18n';

export class AdministratorStoreDto {
  @IsDefined({
    message: t('validation.administrator_store_full_name_is_defined'),
  })
  @IsNotEmpty({
    message: t('validation.administrator_store_full_name_not_empty'),
  })
  fullName: string;

  @Transform(({ value }) => value.toLowerCase())
  @IsDefined({
    message: t('validation.administrator_store_email_is_defined'),
  })
  @IsNotEmpty({ message: t('validation.administrator_store_email_not_empty') })
  @IsEmail({}, { message: t('validation.administrator_store_invalid_email') })
  email: string;

  @IsDefined({
    message: t('validation.administrator_store_password_is_defined'),
  })
  @IsNotEmpty({
    message: t('validation.administrator_store_password_not_empty'),
  })
  @MinLength(8, { message: t('validation.administrator_store_password_min') })
  @Matches(/^\S+$/, {
    message: t('validation.password_can_not_contain_space'),
  })
  password: string;

  @IsDefined({
    message: t('validation.administrator_store_password_confirm_is_defined'),
  })
  @IsNotEmpty({
    message: t('validation.administrator_store_password_confirm_not_empty'),
  })
  @Match('password', {
    message: t('validation.administrator_store_password_dont_match'),
  })
  passwordConfirm: string;

  @IsOptional()
  @Matches(/^(06|08|09)(\d{8})$/, {
    message: t('validation.administrator_store_mobile_invalid'),
  })
  mobile: string;

  @IsDefined({
    message: t('validation.administrator_store_is_active_is_defined'),
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsNotEmpty({
    message: t('validation.administrator_store_is_active_not_empty'),
  })
  isActive: number;

  @IsOptional()
  @ValidateIf((_obj, value) => value !== '' && !isNull(value))
  @IsFile({
    message: t('validation.administrator_store_profile_image_is_file'),
  })
  @HasMimeType(['image/jpeg', 'image/jpg', 'image/png'], {
    message: t('validation.administrator_store_mine_file'),
  })
  @MaxFileSize(5242880, {
    message: t('validation.administrator_store_image_limit_file_size_5mb'),
  })
  profileImage: MemoryStoredFile;
}
