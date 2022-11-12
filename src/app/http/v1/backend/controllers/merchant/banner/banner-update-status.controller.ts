import { Body, Controller, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { BannerResource } from '@resources/backend/merchant/banner/banner.resource';
import { BannerService } from '@services/backend/merchant/banner.service';
import { UpdateStatusDto } from '@dtos/v1/backend/update-status.dto';

@Controller({ path: 'v1/backend/merchant/banners' })
export class BannerUpdateStatusController {
  constructor(private readonly bannerService: BannerService) {}

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<BannerResource> {
    try {
      const banner = await this.bannerService.updateStatus(
        id,
        updateStatusDto.isActive,
      );

      return BannerResource.successResponse(banner);
    } catch (error) {
      return BannerResource.errorResponse(error);
    }
  }
}
