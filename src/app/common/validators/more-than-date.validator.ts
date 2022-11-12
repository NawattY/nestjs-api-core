import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isNotEmpty,
} from 'class-validator';
import { isBefore } from 'date-fns';

export function MoreThanDateValidator(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'MoreThanDateValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments): boolean {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          if (isNotEmpty(value) && isNotEmpty(relatedValue)) {
            return isBefore(new Date(value), new Date(relatedValue));
          }

          return true;
        },
      },
    });
  };
}
