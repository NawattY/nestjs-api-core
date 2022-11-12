import { Body, Controller, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { UpdateStatusDto } from '@dtos/v1/backend/update-status.dto';
import { ProductResource } from '@resources/backend/merchant/product/product.resource';
import { ProductService } from '@services/backend/merchant/product.service';

@Controller({ path: 'v1/backend/merchant/products' })
export class ProductUpdateStatusController {
  constructor(private readonly productService: ProductService) {}

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<ProductResource> {
    try {
      const data = await this.productService.updateStatus(
        id,
        updateStatusDto.isActive,
      );

      return ProductResource.successResponse(data);
    } catch (error) {
      return ProductResource.errorResponse(error);
    }
  }
}
