import { Body, Controller, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { BranchResource } from '@resources/backend/merchant/branch/branch.resource';
import { BranchService } from '@services/backend/merchant/branch.service';
import { BranchUpdateDto } from '@dtos/v1/backend/merchant/branch/branch-update.dto';

@Controller({ path: 'v1/backend/merchant/branches' })
export class BranchUpdateController {
  constructor(private readonly branchService: BranchService) {}

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() validateDto: BranchUpdateDto,
  ): Promise<BranchResource> {
    try {
      const branch = await this.branchService.update(id, validateDto);

      return BranchResource.successResponse(branch);
    } catch (error) {
      BranchResource.errorResponse(error);
    }
  }
}
