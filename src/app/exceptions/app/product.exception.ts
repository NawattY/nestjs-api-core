import { ApiException } from '@exceptions/app/api.exception';

export class ProductException {
  static notFound(): ApiException {
    return new ApiException(800001, []);
  }

  static updateError(error?: string[]): ApiException {
    return new ApiException(800002, error);
  }

  static deleteError(error?: string[]): ApiException {
    return new ApiException(800003, error);
  }

  static createError(error?: string[]): ApiException {
    return new ApiException(800004, error);
  }

  static updateNotAffected(): ApiException {
    return new ApiException(800005);
  }
}
