import { Controller, Get } from '@nestjs/common';
import {
  ApiResource,
  SuccessResponseInterface,
} from 'src/app/http/resources/api.resource';
import { SupportLocaleService } from '@services/backend/merchant/support-locale.service';

@Controller({ path: 'v1/backend/merchant/support-locales' })
export class SupportLocaleController {
  constructor(private readonly supportLocaleService: SupportLocaleService) {}

  @Get('/')
  async getSupportLocales(): Promise<SuccessResponseInterface> {
    const data = await this.supportLocaleService.get();

    return ApiResource.successResponse(data);
  }
}
