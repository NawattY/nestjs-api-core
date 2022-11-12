import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isNotEmpty,
} from 'class-validator';

export function MoreThanNumberValidator(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'MoreThanNumberValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments): boolean {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          if (isNotEmpty(value) && isNotEmpty(relatedValue)) {
            return value > relatedValue;
          }

          return true;
        },
      },
    });
  };
}
