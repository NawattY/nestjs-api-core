import { ApiException } from '@exceptions/app/api.exception';

export class CategoryException {
  static createError(error?: string[]): ApiException {
    return new ApiException(600001, error);
  }

  static notFound(): ApiException {
    return new ApiException(600002, []);
  }

  static updateError(error?: string[]): ApiException {
    return new ApiException(600003, error);
  }

  static deleteError(error?: string[]): ApiException {
    return new ApiException(600004, error);
  }

  static deleteErrorAvailableProducts(): ApiException {
    return new ApiException(600005);
  }

  static updateNotAffected(): ApiException {
    return new ApiException(600006);
  }
}
