import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MerchantException } from '@exceptions/app/merchant.exception';
import { TenantsService } from 'src/app/tenancy/tenancy.service';

@Injectable()
export class InitialMerchantConnection implements NestMiddleware {
  constructor(private readonly tenantService: TenantsService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const merchantId = req.merchantId;

    if (!merchantId) {
      throw MerchantException.merchantHeaderInvalid();
    }

    this.tenantService.setTenantConnection(merchantId);

    process.env.MERCHANT_ID = merchantId.toString();
    req.merchantId = merchantId;

    next();
  }
}
