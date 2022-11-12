import {
  IsNotEmpty,
  IsDefined,
  IsString,
  IsOptional,
  Matches,
  ValidateIf,
  NotEquals,
} from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { isNull } from 'lodash';
import { i18nValidationMessage as t } from 'nestjs-i18n';

export class UpdateTemplateDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined({
    message: t('validation.merchant_update_template_primary_color_is_defined'),
  })
  @Matches(/^#([0-9a-f]{3}){1,2}$/i, {
    message: t('validation.merchant_update_template_format_primary_color'),
  })
  primaryColor: string;

  @IsOptional()
  @Matches(/^#([0-9a-f]{3}){1,2}$/i, {
    message: t('validation.merchant_update_template_format_secondary_color'),
  })
  @NotEquals(null)
  @ValidateIf((object, value) => value !== '')
  secondaryColor: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined({
    message: t(
      'validation.merchant_update_template_text_on_primary_color_is_defined',
    ),
  })
  @Matches(/^#([0-9a-f]{3}){1,2}$/i, {
    message: t(
      'validation.merchant_update_template_format_text_on_primary_color',
    ),
  })
  textOnPrimaryColor: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined({
    message: t(
      'validation.merchant_update_template_background_color_is_defined',
    ),
  })
  @Matches(/^#([0-9a-f]{3}){1,2}$/i, {
    message: t('validation.merchant_update_template_format_background_color'),
  })
  backgroundColor: string;

  @IsOptional()
  @ValidateIf((_obj, value) => value !== '' && !isNull(value))
  @IsFile({
    message: t('validation.merchant_update_template_profile_image_is_file'),
  })
  @HasMimeType(['image/jpeg', 'image/jpg', 'image/png'], {
    message: t('validation.merchant_update_template_mine_file'),
  })
  @MaxFileSize(5242880, {
    message: t('validation.merchant_update_template_image_limit_file_size_5mb'),
  })
  logoImage: MemoryStoredFile;
}
