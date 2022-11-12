import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Validate,
  ValidateIf,
} from 'class-validator';
import { i18nValidationMessage as t } from 'nestjs-i18n';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { isNull } from 'lodash';
import { convertEmptyToNull } from '@helpers/convert-empty-to-null.helper';
import { LinkTypeValidator } from 'src/app/common/validators/link-type-banner.validator';
import { FormatDateOrTimeValidator } from 'src/app/common/validators/format-date-or-time.validator';
import { BannerLinkEnum } from '@enums/banner-link';
import { LessThanDateValidator } from 'src/app/common/validators/less-than-date.validator';
import { AspectRatio } from 'src/app/common/validators/aspect-ratio.validator';

export class BannerUpdateDto {
  @IsDefined({
    message: t('validation.banner_update_title_is_defined'),
  })
  @IsNotEmpty({
    message: t('validation.banner_update_title_required'),
  })
  title: string;

  @IsDefined({
    message: t('validation.banner_update_image_is_defined'),
  })
  @ValidateIf((_obj, value) => value !== '' && !isNull(value))
  @IsFile({
    message: t('validation.banner_update_image_is_file'),
  })
  @HasMimeType(['image/jpeg', 'image/jpg', 'image/png'], {
    message: t('validation.banner_update_mine_file'),
  })
  @MaxFileSize(5242880, {
    message: t('validation.banner_update_image_limit_file_size'),
  })
  @AspectRatio('21:9', {
    message: t('validation.banner_update_image_ratio_error'),
  })
  image: MemoryStoredFile;

  @IsOptional()
  @Transform(({ value }) => convertEmptyToNull(value))
  @FormatDateOrTimeValidator('startDate', {
    message: 'validation.banner_update_start_date_is_invalid',
  })
  startDate: string;

  @IsOptional()
  @Transform(({ value }) => convertEmptyToNull(value))
  @LessThanDateValidator('startDate', {
    message: 'validation.banner_update_end_date_must_be_more_than_start_date',
  })
  @FormatDateOrTimeValidator('endDate', {
    message: 'validation.banner_update_end_date_is_invalid',
  })
  endDate: string;

  @IsDefined({
    message: t('validation.banner_update_link_type_defined'),
  })
  @IsNotEmpty({
    message: t('validation.banner_update_link_type_required'),
  })
  @IsEnum(BannerLinkEnum, {
    message: t('validation.banner_update_link_type_is_enum'),
  })
  linkType: BannerLinkEnum;

  @Transform(({ value }) => convertEmptyToNull(value))
  @Validate(LinkTypeValidator)
  linkTo: string;

  @IsDefined({
    message: t('validation.banner_update_is_active_is_defined'),
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsNotEmpty({
    message: t('validation.banner_update_is_active_required'),
  })
  isActive: number;
}
