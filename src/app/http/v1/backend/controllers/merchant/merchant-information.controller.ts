import { Controller, Get, Request } from '@nestjs/common';
import { MerchantService } from '@services/backend/admin/merchant.service';
import { MerchantResource } from '@resources/backend/merchant/merchant.resource';

@Controller({ path: 'v1/backend/merchant/merchant-information' })
export class MerchantInformationController {
  constructor(private readonly merchantService: MerchantService) {}

  @Get('/')
  async show(@Request() req: any): Promise<MerchantResource> {
    try {
      const data = await this.merchantService.findById(req.merchantId);

      return MerchantResource.successResponse(data);
    } catch (error) {
      return MerchantResource.errorResponse(error);
    }
  }
}
