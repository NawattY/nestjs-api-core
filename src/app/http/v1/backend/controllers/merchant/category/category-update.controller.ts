import { Body, Controller, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { CategoryResource } from '@resources/backend/merchant/category/category.resource';
import { CategoryService } from '@services/backend/merchant/category.service';
import { CategoryUpdateDto } from '@dtos/v1/backend/merchant/category/category-update.dto';

@Controller({ path: 'v1/backend/merchant/categories' })
export class CategoryUpdateController {
  constructor(private readonly categoryService: CategoryService) {}

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() validateDto: CategoryUpdateDto,
  ): Promise<CategoryResource> {
    try {
      const category = await this.categoryService.update(id, validateDto);

      return CategoryResource.successResponse(category);
    } catch (error) {
      return CategoryResource.errorResponse(error);
    }
  }
}
