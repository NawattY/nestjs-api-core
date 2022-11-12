import { Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { MerchantService } from '@services/backend/admin/merchant.service';
import { ApiResource } from 'src/app/http/resources/api.resource';

@Controller({ path: 'v1/backend/admin/merchants' })
export class MerchantDestroyController {
  constructor(private readonly merchantService: MerchantService) {}

  @Delete(':id')
  async destroy(@Param('id', ParseIntPipe) id: number): Promise<ApiResource> {
    try {
      await this.merchantService.destroy(id);

      return ApiResource.successResponse();
    } catch (error) {
      ApiResource.errorResponse(error);
    }
  }
}
