import { Injectable, NestMiddleware } from '@nestjs/common';
import { MerchantService } from '@services/frontend/merchant.service';
import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';

@Injectable()
export class InitialLocale implements NestMiddleware {
  constructor(private readonly merchantService: MerchantService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const merchantSettings = await this.merchantService.getSettings(
      req.merchantId,
    );
    const supportLocales = get(merchantSettings, 'supportLocales', []);
    process.env.LOCALE = get(merchantSettings, 'locale');
    process.env.FALLBACK_LOCALE = get(merchantSettings, 'locale');
    req.locale = get(merchantSettings, 'locale');

    if (
      req.header('x-locale') &&
      supportLocales.includes(req.header('x-locale').toLocaleLowerCase())
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
