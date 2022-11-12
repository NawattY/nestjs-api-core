import { Controller, Get, Request } from '@nestjs/common';
import { ProductCategoryResource } from '@resources/frontend/product-category.resource';
import { ProductService } from '@services/frontend/product.service';

@Controller({ path: 'v1/frontend/products' })
export class ProductGetController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  async get(@Request() request: any): Promise<ProductCategoryResource> {
    try {
      const products = await this.productService.get(request);

      return ProductCategoryResource.successResponse(products);
    } catch (error) {
      ProductCategoryResource.errorResponse(error);
    }
  }
}
