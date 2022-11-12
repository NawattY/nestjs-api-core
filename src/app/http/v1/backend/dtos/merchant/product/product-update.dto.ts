import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Validate,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { isNull } from 'lodash';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { i18nValidationMessage as t } from 'nestjs-i18n';
import { DefaultLocaleValidator } from 'src/app/common/validators/default-locale.validator';
import { FormatDecimalValidator } from 'src/app/common/validators/format-decimal.validator';
import { LessThanNumberValidator } from 'src/app/common/validators/less-than-number.validator';
import { Column } from 'typeorm';

export class ProductUpdateDto {
  @IsOptional()
  @ValidateIf((_obj, value) => value !== '' && !isNull(value))
  @IsFile({ message: t('validation.product_update_image_is_file') })
  @HasMimeType(['image/jpeg', 'image/jpg', 'image/png'], {
    message: t('validation.product_update_image_mine_type'),
  })
  @MaxFileSize(5242880, {
    message: t('validation.product_update_image_limit_file_size'),
  })
  image: MemoryStoredFile;

  @ValidateNested({ each: true })
  @Validate(DefaultLocaleValidator)
  @IsNotEmpty({
    message: t('validation.product_update_title_required'),
  })
  title: string;

  @IsOptional()
  detail: string;

  @IsOptional()
  @IsNumber(
    { allowNaN: false },
    {
      message: t('validation.product_update_special_price_required_is_number'),
    },
  )
  @Transform(({ value }) => parseFloat(value))
  @FormatDecimalValidator('specialPrice', {
    message: 'validation.product_special_price_decimal_is_invalid',
  })
  @LessThanNumberValidator('normalPrice', {
    message: 'validation.product_update_special_price_less_than_normal_price',
  })
  specialPrice: number;

  @IsNotEmpty({
    message: t('validation.product_update_normal_price_required'),
  })
  @IsNumber(
    { allowNaN: false },
    {
      message: t('validation.product_update_normal_price_required_is_number'),
    },
  )
  @Transform(({ value }) => parseFloat(value))
  @FormatDecimalValidator('normalPrice', {
    message: 'validation.product_normal_price_decimal_is_invalid',
  })
  normalPrice: number;

  @IsNumber(
    { allowNaN: false },
    {
      message: t('validation.product_update_category_id_required_is_number'),
    },
  )
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({
    message: t('validation.product_update_category_id_required'),
  })
  categoryId: number;

  @Transform(({ value }) => parseInt(value))
  @Column({ default: 0, unsigned: true })
  @IsNotEmpty({
    message: t('validation.product_update_ordinal_required'),
  })
  ordinal: number;

  @IsNumber(
    { allowNaN: false },
    {
      message: t('validation.product_update_is_active_required_is_number'),
    },
  )
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({
    message: t('validation.product_update_is_active_required'),
  })
  isActive: number;
}
