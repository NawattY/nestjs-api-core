import { Controller, Param, ParseIntPipe, Get, Query } from '@nestjs/common';
import { CategoryResource } from '@resources/backend/merchant/category/category.resource';
import { CategoryService } from '@services/backend/merchant/category.service';

@Controller({ path: 'v1/backend/merchant/categories' })
export class CategoryShowController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get(':id')
  async show(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: any,
  ): Promise<CategoryResource> {
    try {
      const category = await this.categoryService.findById(id, query);

      return CategoryResource.successResponse(category, query);
    } catch (error) {
      return CategoryResource.errorResponse(error);
    }
  }
}
