import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Matches,
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

export class AdministratorUpdateDto {
  @IsDefined({
    message: t('validation.administrator_update_full_name_is_defined'),
  })
  @IsNotEmpty({
    message: t('validation.administrator_update_full_name_not_empty'),
  })
  fullName: string;

  @IsOptional()
  @Matches(/^(06|08|09)(\d{8})$/, {
    message: t('validation.administrator_update_mobile_invalid'),
  })
  mobile: string;

  @IsDefined({
    message: t('validation.administrator_update_is_active_is_defined'),
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsNotEmpty({
    message: t('validation.administrator_update_is_active_not_empty'),
  })
  isActive: number;

  @IsOptional()
  @ValidateIf((_obj, value) => value !== '' && !isNull(value))
  @IsFile({
    message: t('validation.administrator_update_profile_image_is_file'),
  })
  @HasMimeType(['image/jpeg', 'image/jpg', 'image/png'], {
    message: t('validation.administrator_update_mine_file'),
  })
  @MaxFileSize(5242880, {
    message: t('validation.administrator_update_image_limit_file_size_5mb'),
  })
  profileImage: MemoryStoredFile;
}
