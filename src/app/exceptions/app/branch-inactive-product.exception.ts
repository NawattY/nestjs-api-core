import { ApiException } from '@exceptions/app/api.exception';

export class BranchInactiveProductException {
  static deleteError(error?: string[]): ApiException {
    return new ApiException(503001, error);
  }

  static createError(error?: string[]): ApiException {
    return new ApiException(503002, error);
  }

  static updateError(error?: string[]): ApiException {
    return new ApiException(503003, error);
  }
}
