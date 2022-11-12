import { Body, Controller, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { CategoryResource } from '@resources/backend/merchant/category/category.resource';
import { CategoryService } from '@services/backend/merchant/category.service';
import { UpdateStatusDto } from '@dtos/v1/backend/update-status.dto';

@Controller({ path: 'v1/backend/merchant/categories' })
export class CategoryUpdateStatusController {
  constructor(private readonly categoryService: CategoryService) {}

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<CategoryResource> {
    try {
      const category = await this.categoryService.updateStatus(
        id,
        updateStatusDto.isActive,
      );

      return CategoryResource.successResponse(category);
    } catch (error) {
      return CategoryResource.errorResponse(error);
    }
  }
}
