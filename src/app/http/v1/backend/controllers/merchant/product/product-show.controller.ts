import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ProductResource } from '@resources/backend/merchant/product/product.resource';
import { ProductService } from '@services/backend/merchant/product.service';

@Controller({ path: 'v1/backend/merchant/products' })
export class ProductShowController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  async show(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: any,
  ): Promise<ProductResource> {
    try {
      const product = await this.productService.findById(id, query);

      return ProductResource.successResponse(product);
    } catch (error) {
      return ProductResource.errorResponse(error);
    }
  }
}
