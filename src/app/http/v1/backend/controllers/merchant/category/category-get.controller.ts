import { Controller, Get, Query } from '@nestjs/common';
import { CategoryResource } from '@resources/backend/merchant/category/category.resource';
import { CategoryService } from '@services/backend/merchant/category.service';

@Controller({ path: 'v1/backend/merchant/categories' })
export class CategoryGetController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  async get(@Query() query: any): Promise<CategoryResource> {
    try {
      const categories = await this.categoryService.get(query);

      return CategoryResource.successResponse(categories, query);
    } catch (error) {
      return CategoryResource.errorResponse(error);
    }
  }
}
