import { ApiResource } from 'src/app/http/resources/api.resource';
import { Controller, Post } from '@nestjs/common';
import { QrCodeService } from '@services/backend/merchant/qr-code.service';

@Controller({ path: 'v1/backend/merchant/qr-code/digital-menu' })
export class QrCodeDigitalMenuController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @Post('/')
  async get(): Promise<ApiResource> {
    try {
      const qrCode = await this.qrCodeService.getQrCode();

      return ApiResource.successResponse(qrCode);
    } catch (error) {
      return ApiResource.errorResponse(error);
    }
  }
}
