import { Transform } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { i18nValidationMessage as t } from 'nestjs-i18n';

export class UpdateIsActiveAndRecommendDto {
  @Transform(({ value }) => parseInt(value))
  @IsDefined({
    message: t('validation.update_isactive_branch_product_is_defined'),
  })
  @IsNotEmpty({
    message: t('validation.update_isactive_branch_product_is_not_empty'),
  })
  @IsNumber(
    { allowNaN: false },
    {
      message: t('validation.update_isactive_branch_product_is_number'),
    },
  )
  isActive: number;

  @Transform(({ value }) => parseInt(value))
  @IsDefined({
    message: t('validation.update_out_of_stock_branch_product_is_defined'),
  })
  @IsNotEmpty({
    message: t('validation.update_out_of_stock_branch_product_is_not_empty'),
  })
  @IsNumber(
    { allowNaN: false },
    {
      message: t('validation.update_out_of_stock_branch_product_is_number'),
    },
  )
  isOutOfStock: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNotEmpty({
    message: t('validation.update_recommend_branch_product_is_not_empty'),
  })
  @IsNumber(
    { allowNaN: false },
    {
      message: t('validation.update_recommend_branch_product_is_number'),
    },
  )
  isRecommend: number;
}
