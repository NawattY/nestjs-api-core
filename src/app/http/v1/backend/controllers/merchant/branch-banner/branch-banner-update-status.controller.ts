import { UpdateStatusDto } from '@dtos/v1/backend/update-status.dto';
import {
  Controller,
  Param,
  ParseIntPipe,
  Body,
  Patch,
  Request,
} from '@nestjs/common';
import { BannerResource } from '@resources/backend/merchant/banner/banner.resource';
import { BranchBannerResource } from '@resources/backend/merchant/branch-banner/branch-banner.resource';
import { BranchBannerService } from '@services/backend/merchant/branch-banner.service';

@Controller({ path: 'v1/backend/merchant/branch-banners' })
export class BranchBannerUpdateStatusController {
  constructor(private readonly bannerBranchService: BranchBannerService) {}

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Request() request: any,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<BannerResource> {
    try {
      const response = await this.bannerBranchService.updateStatus(id, {
        isActive: updateStatusDto.isActive,
        branchId: request.branchId,
      });

      return BranchBannerResource.successResponse(response);
    } catch (error) {
      BranchBannerResource.errorResponse(error);
    }
  }
}
