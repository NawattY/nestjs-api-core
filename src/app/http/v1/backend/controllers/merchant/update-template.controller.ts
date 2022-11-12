import { Controller, Body, Patch, UseInterceptors } from '@nestjs/common';
import { MerchantService } from '@services/backend/merchant/merchant.service';
import { UpdateTemplateDto } from '@dtos/v1/backend/merchant/update-template.dto';
import { FormDataRequestInterceptor } from 'src/app/common/interceptors/form-data-request.interceptor';
import { FormDataRequest } from 'nestjs-form-data';
import { MerchantResource } from '@resources/backend/merchant/merchant.resource';

@Controller({ path: 'v1/backend/merchant/template' })
export class UpdateTemplateController {
  constructor(private readonly merchantService: MerchantService) {}

  @Patch('/')
  @UseInterceptors(FormDataRequestInterceptor)
  @FormDataRequest()
  async updateTemplate(
    @Body() params: UpdateTemplateDto,
  ): Promise<MerchantResource> {
    try {
      const data = await this.merchantService.updateTemplate(params);

      return MerchantResource.successResponse(data);
    } catch (error) {
      MerchantResource.errorResponse(error);
    }
  }
}
