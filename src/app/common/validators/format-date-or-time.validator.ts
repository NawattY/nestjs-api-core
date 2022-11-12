import { registerDecorator, ValidationOptions } from 'class-validator';

export function FormatDateOrTimeValidator(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'FormatDateOrTimeValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          const isDate = new Date(value).valueOf();

          if (isNaN(isDate)) {
            return false;
          }

          return true;
        },
      },
    });
  };
}
