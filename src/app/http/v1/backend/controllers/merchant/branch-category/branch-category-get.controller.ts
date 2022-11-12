import { Controller, Get, Query, Request } from '@nestjs/common';
import { BranchCategoryResource } from '@resources/backend/merchant/branch-category/branch-category.resource';
import { BranchCategoryService } from '@services/backend/merchant/branch-category.service';

@Controller({ path: 'v1/backend/merchant/branch-categories' })
export class BranchCategoryGetController {
  constructor(private readonly branchCategoryService: BranchCategoryService) {}

  @Get('/')
  async get(
    @Query() query: any,
    @Request() request: any,
  ): Promise<BranchCategoryResource> {
    try {
      const categories = await this.branchCategoryService.get(
        request.branchId,
        query,
      );

      return BranchCategoryResource.successResponse(categories);
    } catch (error) {
      BranchCategoryResource.errorResponse(error);
    }
  }
}
