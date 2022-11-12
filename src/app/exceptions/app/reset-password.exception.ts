import { ApiException } from '@exceptions/app/api.exception';

export class ResetPasswordException {
  static emailNotFound(): ApiException {
    return new ApiException(100100);
  }

  static sendEmailFail(): ApiException {
    return new ApiException(100101);
  }
}
