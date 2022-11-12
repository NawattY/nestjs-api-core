import { ApiException } from '@exceptions/app/api.exception';

export class MailException {
  static sendEmailFailed(error?: string[]): ApiException {
    return new ApiException(100200, error);
  }
}
