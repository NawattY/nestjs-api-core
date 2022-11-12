import { Body, Controller, Post } from '@nestjs/common';
import { AuthResource } from '@resources/backend/share/auth/auth.resource';
import { PasswordResetService } from '@services/backend/share/password-reset.service';
import { PasswordResetRequestDto } from '@dtos/v1/backend/share/password-reset/password-reset-request.dto';

@Controller({ path: 'v1/backend/password-reset/request' })
export class PasswordResetRequestController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Post('/')
  async request(
    @Body() passwordResetRequestDto: PasswordResetRequestDto,
  ): Promise<AuthResource> {
    try {
      const user = await this.passwordResetService.request(
        passwordResetRequestDto,
      );

      return AuthResource.successResponse(user);
    } catch (error) {
      return AuthResource.errorResponse(error);
    }
  }
}
