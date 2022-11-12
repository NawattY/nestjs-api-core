import { ApiException } from '@exceptions/app/api.exception';

export class S3Exception {
  static uploadImageError(error?: string[]): ApiException {
    return new ApiException(400001, error);
  }
}
