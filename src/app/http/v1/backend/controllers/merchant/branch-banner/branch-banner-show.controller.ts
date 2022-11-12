import { Controller, Param, ParseIntPipe, Get, Request } from '@nestjs/common';
import { BannerResource } from '@resources/backend/merchant/banner/banner.resource';
import { BranchBannerResource } from '@resources/backend/merchant/branch-banner/branch-banner.resource';
import { BranchBannerService } from '@services/backend/merchant/branch-banner.service';

@Controller({ path: 'v1/backend/merchant/branch-banners' })
export class BranchBannerShowController {
  constructor(private readonly bannerBranchService: BranchBannerService) {}

  @Get(':id')
  async getBannerById(
    @Param('id', ParseIntPipe) id: number,
    @Request() request: any,
  ): Promise<BannerResource> {
    try {
      const banner = await this.bannerBranchService.findById(
        id,
        request.branchId,
      );

      return BranchBannerResource.successResponse(banner);
    } catch (error) {
      BranchBannerResource.errorResponse(error);
    }
  }
}
