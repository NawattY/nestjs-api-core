import { ApiException } from '@exceptions/app/api.exception';

export class BranchInactiveBannerException {
  static deleteError(error?: string[]): ApiException {
    return new ApiException(502001, error);
  }

  static createError(error?: string[]): ApiException {
    return new ApiException(502002, error);
  }
}
