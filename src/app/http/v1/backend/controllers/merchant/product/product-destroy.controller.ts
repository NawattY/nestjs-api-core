import { Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { ProductResource } from '@resources/backend/merchant/product/product.resource';
import { ProductService } from '@services/backend/merchant/product.service';

@Controller({ path: 'v1/backend/merchant/products' })
export class ProductDestroyController {
  constructor(private readonly productService: ProductService) {}

  @Delete(':id')
  async destroy(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductResource> {
    try {
      const data = await this.productService.destroy(id);

      return ProductResource.successResponse(data);
    } catch (error) {
      return ProductResource.errorResponse(error);
    }
  }
}
