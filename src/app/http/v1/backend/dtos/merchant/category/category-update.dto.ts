import { IsNotEmpty, Validate, ValidateNested } from 'class-validator';
import { i18nValidationMessage as t } from 'nestjs-i18n';
import { DefaultLocaleValidator } from 'src/app/common/validators/default-locale.validator';

export class CategoryUpdateDto {
  @ValidateNested({ each: true })
  @Validate(DefaultLocaleValidator)
  @IsNotEmpty({
    message: t('validation.category_update_title_not_empty'),
  })
  title: string;
}
