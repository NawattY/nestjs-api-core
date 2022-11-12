import { BannerLinkEnum } from '@enums/banner-link';
import { convertEmptyToNull } from '@helpers/convert-empty-to-null.helper';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Validate,
} from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { i18nValidationMessage as t } from 'nestjs-i18n';
import { FormatDateOrTimeValidator } from 'src/app/common/validators/format-date-or-time.validator';
import { LessThanDateValidator } from 'src/app/common/validators/less-than-date.validator';
import { MoreThanDateValidator } from 'src/app/common/validators/more-than-date.validator';
import { LinkTypeValidator } from 'src/app/common/validators/link-type-banner.validator';
import { AspectRatio } from 'src/app/common/validators/aspect-ratio.validator';

export class BannerStoreDto {
  @IsNotEmpty({
    message: t('validation.banner_store_image_required'),
  })
  @Transform(({ value }) => convertEmptyToNull(value))
  @IsFile({ message: t('validation.banner_store_image_is_file') })
  @HasMimeType(['image/jpeg', 'image/jpg', 'image/png'], {
    message: t('validation.banner_store_image_mine_type'),
  })
  @MaxFileSize(5242880, {
    message: t('validation.banner_store_image_limit_file_size'),
  })
  @AspectRatio('21:9', {
    message: t('validation.banner_store_image_ratio_error'),
  })
  image: MemoryStoredFile;

  @IsNotEmpty({
    message: t('validation.banner_store_title_required'),
  })
  title: string;

  @IsOptional()
  @IsEnum(BannerLinkEnum)
  linkType: string;

  @Transform(({ value }) => convertEmptyToNull(value))
  @Validate(LinkTypeValidator)
  linkTo: string;

  @IsOptional()
  @FormatDateOrTimeValidator('startDate', {
    message: 'validation.banner_store_start_date_is_invalid',
  })
  @MoreThanDateValidator('endDate', {
    message: 'validation.banner_store_start_date_more_than_end_date',
  })
  startDate: Date;

  @IsOptional()
  @FormatDateOrTimeValidator('endDate', {
    message: 'validation.banner_store_end_date_is_invalid',
  })
  @LessThanDateValidator('startDate', {
    message: 'validation.banner_store_end_date_less_than_start_date',
  })
  endDate: Date;

  @IsNumber(
    { allowNaN: false },
    {
      message: t('validation.banner_store_ordinal_is_number'),
    },
  )
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({
    message: t('validation.banner_store_ordinal_required'),
  })
  ordinal: number;

  @IsNumber(
    { allowNaN: false },
    {
      message: t('validation.banner_store_is_active_is_number'),
    },
  )
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({
    message: t('validation.banner_store_is_active_required'),
  })
  isActive: number;
}
