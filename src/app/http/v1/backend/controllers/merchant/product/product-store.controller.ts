import { ProductStoreDto } from '@dtos/v1/backend/merchant/product/product-store.dto';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ProductResource } from '@resources/backend/merchant/product/product.resource';
import { ProductService } from '@services/backend/merchant/product.service';
import { FormDataRequest } from 'nestjs-form-data';
import { FormDataRequestInterceptor } from 'src/app/common/interceptors/form-data-request.interceptor';

@Controller({ path: 'v1/backend/merchant/products' })
export class ProductStoreController {
  constructor(private readonly productService: ProductService) {}

  @Post('/')
  @UseInterceptors(FormDataRequestInterceptor)
  @FormDataRequest()
  async store(@Body() body: ProductStoreDto): Promise<ProductResource> {
    try {
      const product = await this.productService.store(body);

      return ProductResource.successResponse(product);
    } catch (error) {
      return ProductResource.errorResponse(error);
    }
  }
}
