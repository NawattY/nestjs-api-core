import { Controller, Get, Query } from '@nestjs/common';
import { ProductResource } from '@resources/backend/merchant/product/product.resource';
import { ProductService } from '@services/backend/merchant/product.service';

@Controller({ path: 'v1/backend/merchant/products' })
export class ProductGetController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  async get(@Query() query: any): Promise<ProductResource> {
    try {
      const products = await this.productService.get(query);

      return ProductResource.successResponse(products);
    } catch (error) {
      return ProductResource.errorResponse(error);
    }
  }
}
