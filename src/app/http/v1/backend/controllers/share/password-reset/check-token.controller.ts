import { Controller, Get, Param } from '@nestjs/common';
import { PasswordResetResource } from '@resources/backend/share/user/password-reset.resource';
import { UserService } from '@services/backend/share/user.service';

@Controller({ path: 'v1/backend/password-reset' })
export class PasswordResetCheckTokenController {
  constructor(private readonly userService: UserService) {}

  @Get(':token')
  async checkPasswordReset(
    @Param('token') token: string,
  ): Promise<PasswordResetResource> {
    try {
      const user = await this.userService.checkPasswordReset(token);

      return PasswordResetResource.successResponse(user);
    } catch (error) {
      PasswordResetResource.errorResponse(error);
    }
  }
}
