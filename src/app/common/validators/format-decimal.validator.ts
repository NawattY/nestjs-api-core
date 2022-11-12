import {
  registerDecorator,
  ValidationOptions,
  isNotEmpty,
} from 'class-validator';

export function FormatDecimalValidator(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'FormatDecimalValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          if (isNotEmpty(value)) {
            const decimals = ['00', '25', '5', '75'];
            const numbers = value.toString().split('.');

            if (isNotEmpty(numbers[1]) && numbers[1].length > 2) {
              return false;
            }

            if (isNotEmpty(numbers[1]) && !decimals.includes(numbers[1])) {
              return false;
            }
          }

          return true;
        },
      },
    });
  };
}
