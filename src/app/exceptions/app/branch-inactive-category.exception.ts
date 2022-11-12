import { ApiException } from '@exceptions/app/api.exception';

export class BranchInactiveCategoryException {
  static deleteError(error?: string[]): ApiException {
    return new ApiException(506001, error);
  }

  static createError(error?: string[]): ApiException {
    return new ApiException(506002, error);
  }
}
