import { ApiException } from '@exceptions/app/api.exception';

export class RecaptchaException {
  /**
   * @returns ApiException
   */
  static notFound(): ApiException {
    return new ApiException(700001, []);
  }

  /**
   * @returns ApiException
   */
  static requestRecaptchaTokenInvalid(): ApiException {
    return new ApiException(700002, []);
  }
}
