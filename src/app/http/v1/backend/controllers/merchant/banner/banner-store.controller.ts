import { BannerStoreDto } from '@dtos/v1/backend/merchant/banner/banner-store.dto';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { BannerResource } from '@resources/backend/merchant/banner/banner.resource';
import { ProductResource } from '@resources/backend/merchant/product/product.resource';
import { BannerService } from '@services/backend/merchant/banner.service';
import { FormDataRequest } from 'nestjs-form-data';
import { FormDataRequestInterceptor } from 'src/app/common/interceptors/form-data-request.interceptor';

@Controller({ path: 'v1/backend/merchant/banners' })
export class BannerStoreController {
  constructor(private readonly bannerService: BannerService) {}

  @Post('/')
  @UseInterceptors(FormDataRequestInterceptor)
  @FormDataRequest()
  async store(@Body() body: BannerStoreDto): Promise<ProductResource> {
    try {
      const product = await this.bannerService.store(body);

      return BannerResource.successResponse(product);
    } catch (error) {
      return BannerResource.errorResponse(error);
    }
  }
}
