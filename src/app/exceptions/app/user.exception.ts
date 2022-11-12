import { ApiException } from '@exceptions/app/api.exception';

export class UserException {
  /**
   * @returns ApiException
   */
  static notFound(): ApiException {
    return new ApiException(100001, []);
  }

  /**
   * @returns ApiException
   */
  static credentialsMismatch(): ApiException {
    return new ApiException(100002, []);
  }

  /**
   * @returns ApiException
   */
  static userInActive(): ApiException {
    return new ApiException(100003, []);
  }

  /**
   * @param error
   * @returns ApiException
   */
  static deleteError(error?: string[]): ApiException {
    return new ApiException(100004, error);
  }

  /**
   * @returns ApiException
   */
  static cannotDeleteYourself(): ApiException {
    return new ApiException(100005, []);
  }

  /**
   * @param error
   * @returns ApiException
   */
  static createError(error?: string[]): ApiException {
    return new ApiException(100006, error);
  }

  /**
   * @returns ApiException
   */
  static updateError(): ApiException {
    return new ApiException(100007, []);
  }

  /**
   * @param error
   * @returns ApiException
   */
  static userExist(error?: string[]): ApiException {
    return new ApiException(100008, error);
  }

  /**
   * @returns ApiException
   */
  static changePasswordError(): ApiException {
    return new ApiException(100009, []);
  }

  /**
   * @param error
   * @returns ApiException
   */
  static oldPasswordWrong(error?: string[]): ApiException {
    return new ApiException(100010, error);
  }

  /**
   * @param error
   * @returns ApiException
   */
  static passwordDuplicate(error?: string[]): ApiException {
    return new ApiException(100011, error);
  }

  /**
   * @returns ApiException
   */
  static securityCodeNotFound(): ApiException {
    return new ApiException(100012, []);
  }

  /**
   * @returns ApiException
   */
  static securityCodeExpired(): ApiException {
    return new ApiException(100013, []);
  }

  /**
   * @returns ApiException
   */
  static confirmPasswordResetError(error?: string[]): ApiException {
    return new ApiException(100014, error);
  }
}
