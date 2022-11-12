import { UpdateStatusDto } from '@dtos/v1/backend/update-status.dto';
import {
  Controller,
  Param,
  ParseIntPipe,
  Body,
  Patch,
  Request,
} from '@nestjs/common';
import { BranchCategoryResource } from '@resources/backend/merchant/branch-category/branch-category.resource';
import { CategoryResource } from '@resources/backend/merchant/category/category.resource';
import { BranchCategoryService } from '@services/backend/merchant/branch-category.service';

@Controller({ path: 'v1/backend/merchant/branch-categories' })
export class BranchCategoryUpdateStatusController {
  constructor(private readonly categoryBranchService: BranchCategoryService) {}

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Request() request: any,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<CategoryResource> {
    try {
      const response = await this.categoryBranchService.updateStatus(id, {
        isActive: updateStatusDto.isActive,
        branchId: request.branchId,
      });

      return BranchCategoryResource.successResponse(response);
    } catch (error) {
      return BranchCategoryResource.errorResponse(error);
    }
  }
}
