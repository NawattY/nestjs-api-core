import { Controller, Get, Param, ParseIntPipe, Request } from '@nestjs/common';
import { ProductResource } from '@resources/frontend/product.resource';
import { ProductService } from '@services/frontend/product.service';

@Controller({ path: 'v1/frontend/products' })
export class ProductShowController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  async show(
    @Param('id', ParseIntPipe) id: number,
    @Request() request: any,
  ): Promise<ProductResource> {
    try {
      const product = await this.productService.findById(id, request);

      return ProductResource.successResponse(product);
    } catch (error) {
      ProductResource.errorResponse(error);
    }
  }
}
