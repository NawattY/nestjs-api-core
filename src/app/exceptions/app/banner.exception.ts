import { ApiException } from '@exceptions/app/api.exception';

export class BannerException {
  /**
   * @param error
   * @returns ApiException
   */
  static createError(error?: string[]): ApiException {
    return new ApiException(501001, error);
  }

  /**
   * @returns ApiException
   */
  static notFound(): ApiException {
    return new ApiException(501002, []);
  }

  /**
   * @param error
   * @returns ApiException
   */
  static updateError(error?: string[]): ApiException {
    return new ApiException(501003, error);
  }

  /**
   * @returns ApiException
   */
  static updateNotAffected(): ApiException {
    return new ApiException(501004);
  }

  /**
   * @param error
   * @returns ApiException
   */
  static deleteError(error?: string[]): ApiException {
    return new ApiException(501005, error);
  }
}
