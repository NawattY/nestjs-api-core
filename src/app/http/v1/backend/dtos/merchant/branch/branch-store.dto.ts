import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Validate,
  ValidateNested,
} from 'class-validator';
import { i18nValidationMessage as t } from 'nestjs-i18n';
import { DefaultLocaleValidator } from 'src/app/common/validators/default-locale.validator';

export class BranchStoreDto {
  @ValidateNested({ each: true })
  @Validate(DefaultLocaleValidator)
  @IsNotEmpty()
  title: string;

  @IsOptional()
  detail: string;

  @IsOptional()
  phone: string;

  @IsDefined({
    message: t('validation.branch_create_is_active_is_defined'),
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsNotEmpty({
    message: t('validation.branch_create_is_active_required'),
  })
  isActive: number;
}
