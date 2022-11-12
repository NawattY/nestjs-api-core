import { Controller, Get, Param, ParseIntPipe, Request } from '@nestjs/common';
import { BannerResource } from '@resources/frontend/banner.resource';
import { BannerService } from '@services/frontend/banner.service';

@Controller({ path: 'v1/frontend/banners' })
export class BannerShowController {
  constructor(private readonly bannerService: BannerService) {}

  @Get(':id')
  async show(
    @Param('id', ParseIntPipe) id: number,
    @Request() request: any,
  ): Promise<BannerResource> {
    try {
      const banner = await this.bannerService.findById(id, request.branchId);

      return BannerResource.successResponse(banner);
    } catch (error) {
      return BannerResource.errorResponse(error);
    }
  }
}
