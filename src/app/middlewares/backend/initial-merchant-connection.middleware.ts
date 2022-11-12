import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MerchantException } from '@exceptions/app/merchant.exception';
import { get } from 'lodash';
import { UserType } from '@enums/user-type';
import { decodeId } from '@helpers/hash-id.helper';
import { TenantsService } from 'src/app/tenancy/tenancy.service';

@Injectable()
export class InitialMerchantConnection implements NestMiddleware {
  constructor(private readonly tenantService: TenantsService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    if (
      !req.user ||
      ![UserType.ADMIN, UserType.MERCHANT].includes(get(req.user, 'type'))
    ) {
      throw new UnauthorizedException();
    }

    let merchantId: number = parseInt(get(req.user, 'merchantId'));
    if (get(req.user, 'type') === UserType.ADMIN) {
      merchantId = decodeId(req.header('x-merchant')) as number;

      if (!merchantId) {
        throw MerchantException.merchantHeaderInvalid();
      }
    }

    this.tenantService.setTenantConnection(merchantId);

    process.env.MERCHANT_ID = merchantId.toString();
    req.merchantId = merchantId;

    next();
  }
}
