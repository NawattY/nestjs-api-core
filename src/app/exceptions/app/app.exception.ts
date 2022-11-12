import { ApiException } from '@exceptions/app/api.exception';

export class AppException {
  static prototypeError(): ApiException {
    return new ApiException(900000, []);
  }
}
