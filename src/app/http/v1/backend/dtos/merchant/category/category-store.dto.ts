import { IsNotEmpty, Validate, ValidateNested } from 'class-validator';
import { DefaultLocaleValidator } from 'src/app/common/validators/default-locale.validator';
import { i18nValidationMessage as t } from 'nestjs-i18n';

export class CategoryStoreDto {
  @ValidateNested({ each: true })
  @Validate(DefaultLocaleValidator)
  @IsNotEmpty({
    message: t('validation.category_store_title_not_empty'),
  })
  title: string;
}
