import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiResource,
  SuccessResponseInterface,
} from 'src/app/http/resources/api.resource';
import { MerchantService } from '@services/backend/admin/merchant.service';
import { MerchantStoreDto } from '@dtos/v1/backend/admin/merchant/merchant-store.dto';

@Controller({ path: 'v1/backend/admin/merchants' })
export class MerchantStoreController {
  constructor(private readonly merchantService: MerchantService) {}

  @Post('/')
  async store(
    @Body() params: MerchantStoreDto,
  ): Promise<SuccessResponseInterface> {
    const data = await this.merchantService.store(params);

    return ApiResource.successResponse(data);
  }
}
