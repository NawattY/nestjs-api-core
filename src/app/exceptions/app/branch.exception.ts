import { ApiException } from '@exceptions/app/api.exception';

export class BranchException {
  static createError(error?: string[]): ApiException {
    return new ApiException(500001, error);
  }

  static notFound(): ApiException {
    return new ApiException(500002, []);
  }

  static updateError(error?: string[]): ApiException {
    return new ApiException(500003, error);
  }

  static deleteError(error?: string[]): ApiException {
    return new ApiException(500004, error);
  }
}
