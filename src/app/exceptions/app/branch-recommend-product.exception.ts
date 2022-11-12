import { ApiException } from '@exceptions/app/api.exception';

export class BranchRecommendProductException {
  static deleteError(error?: string[]): ApiException {
    return new ApiException(504001, error);
  }

  static createError(error?: string[]): ApiException {
    return new ApiException(504002, error);
  }
}
