import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MerchantException } from '@exceptions/app/merchant.exception';
import { BranchService } from '@services/backend/merchant/branch.service';

@Injectable()
export class AppendBranch implements NestMiddleware {
  constructor(private readonly branchService: BranchService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const branchId = +req.header('x-branch');

    if (!branchId) {
      throw MerchantException.requiredBranchId();
    }

    await this.branchService.findById(branchId);

    process.env.BRANCH_ID = branchId.toString();
    req.branchId = branchId;

    next();
  }
}
