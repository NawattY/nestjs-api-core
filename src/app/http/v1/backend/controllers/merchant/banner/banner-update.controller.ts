import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { BannerResource } from '@resources/backend/merchant/banner/banner.resource';
import { BannerService } from '@services/backend/merchant/banner.service';
import { BannerUpdateDto } from '@dtos/v1/backend/merchant/banner/banner-update.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { FormDataRequestInterceptor } from 'src/app/common/interceptors/form-data-request.interceptor';

@Controller({ path: 'v1/backend/merchant/banners' })
export class BannerUpdateController {
  constructor(private readonly bannerService: BannerService) {}

  @Patch(':id')
  @UseInterceptors(FormDataRequestInterceptor)
  @FormDataRequest()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() validateDto: BannerUpdateDto,
  ): Promise<BannerResource> {
    try {
      const banner = await this.bannerService.update(id, validateDto);

      return BannerResource.successResponse(banner);
    } catch (error) {
      return BannerResource.errorResponse(error);
    }
  }
}
