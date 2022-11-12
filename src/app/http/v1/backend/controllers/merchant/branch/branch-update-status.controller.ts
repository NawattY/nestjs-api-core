import { Body, Controller, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { BranchResource } from '@resources/backend/merchant/branch/branch.resource';
import { BranchService } from '@services/backend/merchant/branch.service';
import { UpdateStatusDto } from '@dtos/v1/backend/update-status.dto';

@Controller({ path: 'v1/backend/merchant/branches' })
export class BranchUpdateStatusController {
  constructor(private readonly branchService: BranchService) {}

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<BranchResource> {
    try {
      const branch = await this.branchService.updateStatus(
        id,
        updateStatusDto.isActive,
      );

      return BranchResource.successResponse(branch);
    } catch (error) {
      return BranchResource.errorResponse(error);
    }
  }
}
