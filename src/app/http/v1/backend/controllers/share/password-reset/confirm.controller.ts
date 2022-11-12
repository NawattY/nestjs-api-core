import { PasswordResetConfirmDto } from '@dtos/v1/backend/share/password-reset/password-reset-confirm.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '@services/backend/share/user.service';
import { ApiResource } from 'src/app/http/resources/api.resource';

@Controller({ path: 'v1/backend/password-reset' })
export class PasswordResetConfirmController {
  constructor(private readonly userService: UserService) {}

  @Post('confirm')
  async confirmPasswordReset(
    @Body() parameters: PasswordResetConfirmDto,
  ): Promise<ApiResource> {
    try {
      await this.userService.confirmPasswordReset(parameters);

      return ApiResource.successResponse();
    } catch (error) {
      return ApiResource.errorResponse(error);
    }
  }
}
