import { Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { CategoryResource } from '@resources/backend/merchant/category/category.resource';
import { CategoryService } from '@services/backend/merchant/category.service';

@Controller({ path: 'v1/backend/merchant/categories' })
export class CategoryDestroyController {
  constructor(private readonly categoryService: CategoryService) {}

  @Delete(':id')
  async destroy(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CategoryResource> {
    try {
      const category = await this.categoryService.destroy(id);

      return CategoryResource.successResponse(category);
    } catch (error) {
      return CategoryResource.errorResponse(error);
    }
  }
}
