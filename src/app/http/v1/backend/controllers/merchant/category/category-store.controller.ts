import { Body, Controller, Post } from '@nestjs/common';
import { CategoryResource } from '@resources/backend/merchant/category/category.resource';
import { CategoryService } from '@services/backend/merchant/category.service';
import { CategoryStoreDto } from '@dtos/v1/backend/merchant/category/category-store.dto';

@Controller({ path: 'v1/backend/merchant/categories' })
export class CategoryStoreController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/')
  async store(
    @Body() validateDto: CategoryStoreDto,
  ): Promise<CategoryResource> {
    try {
      const category = await this.categoryService.store(validateDto);

      return CategoryResource.successResponse(category);
    } catch (error) {
      return CategoryResource.errorResponse(error);
    }
  }
}
