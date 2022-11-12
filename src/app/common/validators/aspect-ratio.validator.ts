import {
  ValidateBy,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { isFile, MemoryStoredFile } from 'nestjs-form-data';
import { default as sharp } from 'sharp';

export function AspectRatio(
  allowedAspectRatio: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'AspectRatio',
      constraints: [allowedAspectRatio],
      validator: {
        async validate(file: MemoryStoredFile, args: ValidationArguments) {
          if (isFile(file)) {
            const allowedAspectRatio = args.constraints[0] || '';
            const imageDetail = sharp(file.buffer);
            const uploadImageMetaData = await imageDetail.metadata();
            const [defaultRatioWidth, defaultRatioHeight] =
              allowedAspectRatio.split(':');
            const acceptHeight = parseInt(
              (
                (defaultRatioHeight / defaultRatioWidth) *
                uploadImageMetaData.width
              ).toString(),
            );

            return uploadImageMetaData.height === acceptHeight;
          }

          return false;
        },

        defaultMessage(args: ValidationArguments): any {
          const allowedAspectRatio = args.constraints[0] || '';

          return `File must be aspect ratio ${allowedAspectRatio}`;
        },
      },
    },
    validationOptions,
  );
}
