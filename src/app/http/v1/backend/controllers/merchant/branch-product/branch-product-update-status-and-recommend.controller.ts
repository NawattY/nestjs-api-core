import { UpdateIsActiveAndRecommendDto } from '@dtos/v1/backend/merchant/branch-product/update-isactive-and-recommend.dto';
import {
  Controller,
  Param,
  ParseIntPipe,
  Body,
  Patch,
  Request,
} from '@nestjs/common';
import { ProductResource } from '@resources/backend/merchant/product/product.resource';
import { BranchProductService } from '@services/backend/merchant/branch-product.service';

@Controller({ path: 'v1/backend/merchant/branch-products' })
export class BranchProductUpdateStatusAndRecommendController {
  constructor(private readonly branchProductService: BranchProductService) {}

  @Patch(':id')
  async updateStatusAndRecommend(
    @Param('id', ParseIntPipe) id: number,
    @Request() request: any,
    @Body() updateDto: UpdateIsActiveAndRecommendDto,
  ): Promise<ProductResource> {
    try {
      const response = await this.branchProductService.updateStatusAndRecommend(
        id,
        {
          isActive: updateDto.isActive,
          isRecommend: updateDto.isRecommend,
          isOutOfStock: updateDto.isOutOfStock,
          branchId: request.branchId,
        },
      );

      return ProductResource.successResponse(response);
    } catch (error) {
      ProductResource.errorResponse(error);
    }
  }
}
