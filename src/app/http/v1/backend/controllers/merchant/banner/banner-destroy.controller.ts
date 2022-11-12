import { Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { BannerService } from '@services/backend/merchant/banner.service';
import { ApiResource } from 'src/app/http/resources/api.resource';

@Controller({ path: 'v1/backend/merchant/banners' })
export class BannerDestroyController {
  constructor(private readonly bannerService: BannerService) {}

  @Delete(':id')
  async destroy(@Param('id', ParseIntPipe) id: number): Promise<ApiResource> {
    try {
      await this.bannerService.destroy(id);

      return ApiResource.successResponse();
    } catch (error) {
      ApiResource.errorResponse(error);
    }
  }
}
