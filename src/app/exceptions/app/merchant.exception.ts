import { ApiException } from '@exceptions/app/api.exception';

export class MerchantException {
  static notFound(): ApiException {
    return new ApiException(200001, []);
  }

  static merchantConnectionFailed(): ApiException {
    return new ApiException(200002, []);
  }

  static merchantHeaderInvalid(): ApiException {
    return new ApiException(200000, []);
  }

  static userEmailAlreadyExist(): ApiException {
    return new ApiException(200003, []);
  }

  static updateError(error?: string[]): ApiException {
    return new ApiException(200004, error);
  }

  static deleteError(error?: string[]): ApiException {
    return new ApiException(200005, error);
  }

  static duplicateDomain(): ApiException {
    return new ApiException(200006, []);
  }

  static notHasDefaultLocale(): ApiException {
    return new ApiException(200007, []);
  }

  static updateLocaleError(error?: string[]): ApiException {
    return new ApiException(200008, error);
  }

  static supportLocaleMismatch(): ApiException {
    return new ApiException(200009, []);
  }

  static missingLocale(): ApiException {
    return new ApiException(200010, []);
  }

  static updateTemplateError(error?: string[]): ApiException {
    return new ApiException(200011, error);
  }

  static requiredBranchId(): ApiException {
    return new ApiException(200012, []);
  }
}
