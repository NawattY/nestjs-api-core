import { Body, Controller, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { MerchantService } from '@services/backend/admin/merchant.service';
import { UpdateStatusDto } from '@dtos/v1/backend/update-status.dto';
import { MerchantResource } from '@resources/backend/admin/merchant/merchant.resource';

@Controller({ path: 'v1/backend/admin/merchants' })
export class MerchantUpdateStatusController {
  constructor(private readonly merchantService: MerchantService) {}

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<MerchantResource> {
    try {
      const data = await this.merchantService.updateStatus(
        id,
        updateStatusDto.isActive,
      );

      return MerchantResource.successResponse(data);
    } catch (error) {
      return MerchantResource.errorResponse(error);
    }
  }
}
