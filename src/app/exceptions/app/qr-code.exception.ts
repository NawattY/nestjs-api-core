import { ApiException } from '@exceptions/app/api.exception';

export class QrCodeException {
  static CreateQrCodeError(): ApiException {
    return new ApiException(505001);
  }
}
