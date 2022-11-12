import { Body, Controller, Post } from '@nestjs/common';
import { BranchResource } from '@resources/backend/merchant/branch/branch.resource';
import { BranchService } from '@services/backend/merchant/branch.service';
import { BranchStoreDto } from '@dtos/v1/backend/merchant/branch/branch-store.dto';

@Controller({ path: 'v1/backend/merchant/branches' })
export class BranchStoreController {
  constructor(private readonly branchService: BranchService) {}

  @Post('/')
  async store(@Body() validateDto: BranchStoreDto): Promise<BranchResource> {
    try {
      const branch = await this.branchService.store(validateDto);

      return BranchResource.successResponse(branch);
    } catch (error) {
      return BranchResource.errorResponse(error);
    }
  }
}
