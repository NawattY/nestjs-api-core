import { Body, Controller, Post } from '@nestjs/common';
import { ApiResource } from 'src/app/http/resources/api.resource';
import { AdministratorService } from '@services/backend/admin/administrator.service';
import { AccessMerchantDto } from '@dtos/v1/backend/admin/access-merchant.dto';

@Controller({ path: 'v1/backend/admin/access-merchant' })
export class AccessMerchantController {
  constructor(private readonly administratorService: AdministratorService) {}

  @Post('/')
  async accessMerchant(@Body() dto: AccessMerchantDto): Promise<ApiResource> {
    try {
      const data = await this.administratorService.accessMerchant(
        dto.merchantId,
      );

      return ApiResource.successResponse(data);
    } catch (error) {
      ApiResource.errorResponse(error);
    }
  }
}
