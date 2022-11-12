import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MerchantException } from '@exceptions/app/merchant.exception';
import { BranchService } from '@services/frontend/branch.service';
import { decodeId } from '@helpers/hash-id.helper';

@Injectable()
export class AppendBranch implements NestMiddleware {
  constructor(private readonly branchService: BranchService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const branchId = decodeId(req.header('x-branch')) as number;

    if (!branchId) {
      throw MerchantException.requiredBranchId();
    }

    await this.branchService.findById(branchId);

    process.env.BRANCH_ID = branchId.toString();
    req.branchId = branchId;

    next();
  }
}
