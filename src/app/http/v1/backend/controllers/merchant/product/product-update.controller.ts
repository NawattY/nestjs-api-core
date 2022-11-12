import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { ProductResource } from '@resources/backend/merchant/product/product.resource';
import { ProductService } from '@services/backend/merchant/product.service';
import { ProductUpdateDto } from '@dtos/v1/backend/merchant/product/product-update.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { FormDataRequestInterceptor } from 'src/app/common/interceptors/form-data-request.interceptor';

@Controller({ path: 'v1/backend/merchant/products' })
export class ProductUpdateController {
  constructor(private readonly productService: ProductService) {}

  @Patch(':id')
  @UseInterceptors(FormDataRequestInterceptor)
  @FormDataRequest()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() validateDto: ProductUpdateDto,
  ): Promise<ProductResource> {
    try {
      const product = await this.productService.update(id, validateDto);

      return ProductResource.successResponse(product);
    } catch (error) {
      ProductResource.errorResponse(error);
    }
  }
}
