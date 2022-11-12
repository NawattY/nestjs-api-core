import { Body, Controller, Patch } from '@nestjs/common';
import { CategoryService } from '@services/backend/merchant/category.service';
import { UpdateOrdinalDto } from '@dtos/v1/backend/update-ordinal.dto';
import { ApiResource } from 'src/app/http/resources/api.resource';

@Controller({ path: 'v1/backend/merchant/categories' })
export class CategoryUpdateOrdinalController {
  constructor(private readonly categoryService: CategoryService) {}

  @Patch('ordinal')
  async updateOrdinal(@Body() dto: UpdateOrdinalDto): Promise<ApiResource> {
    try {
      await this.categoryService.updateOrdinal(dto);

      return ApiResource.successResponse();
    } catch (error) {
      ApiResource.errorResponse(error);
    }
  }
}
