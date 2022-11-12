import { Controller, Get, Query } from '@nestjs/common';
import { MerchantService } from '@services/backend/admin/merchant.service';
import { MerchantResource } from '@resources/backend/admin/merchant/merchant.resource';

@Controller({ path: 'v1/backend/admin/merchants' })
export class MerchantGetController {
  constructor(private readonly merchantService: MerchantService) {}

  @Get('/')
  async get(@Query() query: any): Promise<MerchantResource> {
    try {
      const data = await this.merchantService.get(query);

      return MerchantResource.successResponse(data);
    } catch (error) {
      MerchantResource.errorResponse(error);
    }
  }
}
