import { Controller, Get, Query } from '@nestjs/common';
import { BranchResource } from '@resources/backend/merchant/branch/branch.resource';
import { BranchService } from '@services/backend/merchant/branch.service';

@Controller({ path: 'v1/backend/merchant/branches' })
export class BranchGetController {
  constructor(private readonly branchService: BranchService) {}

  @Get('/')
  async get(@Query() query: any): Promise<BranchResource> {
    try {
      const branches = await this.branchService.get(query);

      return BranchResource.successResponse(branches);
    } catch (error) {
      return BranchResource.errorResponse(error);
    }
  }
}
