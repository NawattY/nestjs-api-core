import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MerchantService as FrontendMerchantService } from '@services/frontend/merchant.service';

@Injectable()
export class InitialVerifyDomainByReferer implements NestMiddleware {
  constructor(private readonly merchantService: FrontendMerchantService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    if (!req.headers.referer) {
      throw new NotFoundException();
    }

    let domain = req.headers.referer;
    if (domain.match(/:\/\/(.[^/]+)/)) {
      domain = domain.match(/:\/\/(.[^/]+)/)[1];
    }

    if (domain.match(/:/)) {
      domain = domain.split(':')[0];
    }

    const merchant = await this.merchantService.getByDomain(domain);

    process.env.MERCHANT_ID = merchant.id.toString();
    req.merchantId = +merchant.id;

    next();
  }
}
