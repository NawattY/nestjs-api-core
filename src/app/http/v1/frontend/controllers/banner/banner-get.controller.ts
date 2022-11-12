import { Controller, Get, Request } from '@nestjs/common';
import { BannerService } from '@services/frontend/banner.service';
import { BannerResource } from '@resources/frontend/banner.resource';

@Controller({ path: 'v1/frontend/banners' })
export class BannerGetController {
  constructor(private readonly bannerService: BannerService) {}

  @Get('/')
  async get(@Request() request: any): Promise<BannerResource> {
    try {
      const banners = await this.bannerService.get(request.branchId);

      return BannerResource.successResponse(banners);
    } catch (error) {
      return BannerResource.errorResponse(error);
    }
  }
}
