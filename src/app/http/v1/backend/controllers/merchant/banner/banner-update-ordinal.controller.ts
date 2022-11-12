import { Body, Controller, Patch } from '@nestjs/common';
import { UpdateOrdinalDto } from '@dtos/v1/backend/update-ordinal.dto';
import { ApiResource } from 'src/app/http/resources/api.resource';
import { BannerService } from '@services/backend/merchant/banner.service';

@Controller({ path: 'v1/backend/merchant/banners' })
export class BannerUpdateOrdinalController {
  constructor(private readonly bannerService: BannerService) {}

  @Patch('ordinal')
  async updateOrdinal(@Body() dto: UpdateOrdinalDto): Promise<ApiResource> {
    try {
      await this.bannerService.updateOrdinal(dto);

      return ApiResource.successResponse();
    } catch (error) {
      ApiResource.errorResponse(error);
    }
  }
}
