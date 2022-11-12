import { Controller, Param, ParseIntPipe, Get } from '@nestjs/common';
import { BranchResource } from '@resources/backend/merchant/branch/branch.resource';
import { BranchService } from '@services/backend/merchant/branch.service';

@Controller({ path: 'v1/backend/merchant/branches' })
export class BranchShowController {
  constructor(private readonly branchService: BranchService) {}

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number): Promise<BranchResource> {
    try {
      const branch = await this.branchService.findById(id);

      return BranchResource.successResponse(branch);
    } catch (error) {
      return BranchResource.errorResponse(error);
    }
  }
}
