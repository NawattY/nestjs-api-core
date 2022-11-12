/* eslint-disable @typescript-eslint/no-unused-vars */
import { BACKEND_LOCALE } from '@constants/backend-locale';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { MerchantService } from '@services/backend/admin/merchant.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class InitialLocale implements NestMiddleware {
  constructor(private readonly merchantService: MerchantService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    process.env.LOCALE = 'th';
    process.env.FALLBACK_LOCALE = 'th';
    req.locale = 'th';

    if (
      req.header('x-locale') &&
      BACKEND_LOCALE.includes(req.header('x-locale').toLocaleLowerCase())
    ) {
      process.env.LOCALE = req.header('x-locale').toLocaleLowerCase();
      req.locale = req.header('x-locale').toLocaleLowerCase();
    }

    if (process.env.MERCHANT_ID) {
      process.env.MERCHANT_DEFAULT_LOCALE =
        await this.merchantService.getDefaultLocale(
          parseInt(process.env.MERCHANT_ID),
        );
    }

    next();
  }
}
