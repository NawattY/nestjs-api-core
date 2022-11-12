import { Controller, Body, Patch, ParseIntPipe, Param } from '@nestjs/common';
import { MerchantService } from '@services/backend/admin/merchant.service';
import { MerchantResource } from '@resources/backend/admin/merchant/merchant.resource';
import { MerchantUpdateDto } from '@dtos/v1/backend/admin/merchant/update.dto';

@Controller({ path: 'v1/backend/admin/merchants' })
export class MerchantUpdateController {
  constructor(private readonly merchantService: MerchantService) {}

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() params: MerchantUpdateDto,
  ): Promise<MerchantResource> {
    try {
      const data = await this.merchantService.update(id, params);

      return MerchantResource.successResponse(data);
    } catch (error) {
      return MerchantResource.errorResponse(error);
    }
  }
}
