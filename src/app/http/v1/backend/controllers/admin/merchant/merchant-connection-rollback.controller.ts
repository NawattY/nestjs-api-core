import { Controller, Post } from '@nestjs/common';
import { ApiResource } from 'src/app/http/resources/api.resource';
import { TenantsService } from 'src/app/tenancy/tenancy.service';

@Controller({ path: 'v1/backend/admin/merchant-connections' })
export class MerchantConnectionRollbackController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post('rollback')
  async rollback(): Promise<void> {
    try {
      await this.tenantsService.rollbackAll();
    } catch (error) {
      ApiResource.errorResponse(error);
    }
  }
}
