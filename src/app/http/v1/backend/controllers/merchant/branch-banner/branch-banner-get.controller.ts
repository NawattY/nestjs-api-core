import { Controller, Get, Query, Request } from '@nestjs/common';
import { BranchBannerService } from '@services/backend/merchant/branch-banner.service';
import { BranchBannerResource } from '@resources/backend/merchant/branch-banner/branch-banner.resource';

@Controller({ path: 'v1/backend/merchant/branch-banners' })
export class BranchBannerGetController {
  constructor(private readonly bannerBranchService: BranchBannerService) {}

  @Get('/')
  async get(
    @Query() query: any,
    @Request() request: any,
  ): Promise<BranchBannerResource> {
    try {
      const banners = await this.bannerBranchService.get(
        request.branchId,
        query,
      );

      return BranchBannerResource.successResponse(banners);
    } catch (error) {
      BranchBannerResource.errorResponse(error);
    }
  }
}
