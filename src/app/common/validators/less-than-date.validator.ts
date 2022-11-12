import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isNotEmpty,
} from 'class-validator';
import { isAfter } from 'date-fns';

export function LessThanDateValidator(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'LessThanDateValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments): boolean {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          if (isNotEmpty(value) && isNotEmpty(relatedValue)) {
            return isAfter(new Date(value), new Date(relatedValue));
          }

          return true;
        },
      },
    });
  };
}
