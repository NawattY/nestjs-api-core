import { IsNotEmpty, IsOptional, Matches, ValidateIf } from 'class-validator';
import { isNull } from 'lodash';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { i18nValidationMessage as t } from 'nestjs-i18n';

export class ProfileUpdateDto {
  @IsNotEmpty({ message: t('validation.profile_update_full_name_not_empty') })
  fullName: string;

  @IsOptional()
  @ValidateIf((_obj, value) => value !== '' && !isNull(value))
  @Matches(/^(06|08|09)(\d{8})$/, {
    message: t('validation.profile_update_mobile_invalid'),
  })
  mobile: string;

  @IsOptional()
  @ValidateIf((_obj, value) => value !== '' && !isNull(value))
  @IsFile({ message: t('validation.profile_update_image_is_file') })
  @HasMimeType(['image/jpeg', 'image/jpg', 'image/png'], {
    message: t('validation.profile_update_image_mine_type'),
  })
  @MaxFileSize(5242880, {
    message: t('validation.profile_update_image_limit_file_size'),
  })
  profileImage: MemoryStoredFile;
}
