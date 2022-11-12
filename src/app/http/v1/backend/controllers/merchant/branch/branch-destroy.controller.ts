import { Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { BranchResource } from '@resources/backend/merchant/branch/branch.resource';
import { BranchService } from '@services/backend/merchant/branch.service';

@Controller({ path: 'v1/backend/merchant/branches' })
export class BranchDestroyController {
  constructor(private readonly branchService: BranchService) {}

  @Delete(':id')
  async destroy(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BranchResource> {
    try {
      const branch = await this.branchService.destroy(id);

      return BranchResource.successResponse(branch);
    } catch (error) {
      return BranchResource.errorResponse(error);
    }
  }
}
