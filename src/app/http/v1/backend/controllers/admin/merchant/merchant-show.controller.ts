import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MerchantService } from '@services/backend/admin/merchant.service';
import { MerchantResource } from '@resources/backend/admin/merchant/merchant.resource';

@Controller({ path: 'v1/backend/admin/merchants' })
export class MerchantGetByIdController {
  constructor(private readonly merchantService: MerchantService) {}

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number): Promise<MerchantResource> {
    try {
      const data = await this.merchantService.findById(id);

      return MerchantResource.successResponse(data);
    } catch (error) {
      return MerchantResource.errorResponse(error);
    }
  }
}
