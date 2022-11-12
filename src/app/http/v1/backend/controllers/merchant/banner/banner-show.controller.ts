import { Controller, Param, ParseIntPipe, Get } from '@nestjs/common';
import { BannerResource } from '@resources/backend/merchant/banner/banner.resource';
import { BannerService } from '@services/backend/merchant/banner.service';

@Controller({ path: 'v1/backend/merchant/banners' })
export class BannerShowController {
  constructor(private readonly bannerService: BannerService) {}

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number): Promise<BannerResource> {
    try {
      const banner = await this.bannerService.findById(id);

      return BannerResource.successResponse(banner);
    } catch (error) {
      return BannerResource.errorResponse(error);
    }
  }
}
