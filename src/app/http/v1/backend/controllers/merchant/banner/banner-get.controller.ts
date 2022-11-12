import { Controller, Get, Query } from '@nestjs/common';
import { BannerService } from '@services/backend/merchant/banner.service';
import { BannerResource } from '@resources/backend/merchant/banner/banner.resource';

@Controller({ path: 'v1/backend/merchant/banners' })
export class BannerGetController {
  constructor(private readonly bannerService: BannerService) {}

  @Get('/')
  async get(@Query() query: any): Promise<BannerResource> {
    try {
      const banners = await this.bannerService.get(query);

      return BannerResource.successResponse(banners);
    } catch (error) {
      return BannerResource.errorResponse(error);
    }
  }
}
