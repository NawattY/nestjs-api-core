import { Controller, Get, Request } from '@nestjs/common';
import { MerchantService } from '@services/frontend/merchant.service';
import { MerchantSettingResource } from '@resources/frontend/merchant-setting.resource';

@Controller({ path: 'v1/frontend/settings' })
export class SettingGetController {
  constructor(private readonly merchantService: MerchantService) {}

  @Get('/')
  async get(@Request() request: any): Promise<MerchantSettingResource> {
    try {
      const merchant = await this.merchantService.getSettings(
        request.merchantId,
      );

      return MerchantSettingResource.successResponse(merchant);
    } catch (error) {
      MerchantSettingResource.errorResponse(error);
    }
  }
}
