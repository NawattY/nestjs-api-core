import { Controller, Body, Patch } from '@nestjs/common';
import { MerchantService } from '@services/backend/merchant/merchant.service';
import { UpdateLocaleDto } from '@dtos/v1/backend/merchant/update-locale.dto';
import { ApiResource } from 'src/app/http/resources/api.resource';

@Controller({ path: 'v1/backend/merchant/locales' })
export class UpdateLocaleController {
  constructor(private readonly merchantService: MerchantService) {}

  @Patch('/')
  async update(@Body() params: UpdateLocaleDto): Promise<ApiResource> {
    try {
      await this.merchantService.updateLocale(params);

      return ApiResource.successResponse();
    } catch (error) {
      ApiResource.errorResponse(error);
    }
  }
}
