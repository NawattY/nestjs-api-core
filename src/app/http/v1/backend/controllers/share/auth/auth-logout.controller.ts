import { Controller, Post } from '@nestjs/common';
import {
  ApiResource,
  SuccessResponseInterface,
} from 'src/app/http/resources/api.resource';
import { AuthService } from '@services/backend/share/auth.service';
import { AuthUser } from '@decorators/backend/auth-user.decorator';

@Controller({ path: 'v1/backend/auth' })
export class AuthLogoutController {
  constructor(private readonly authService: AuthService) {}

  @Post('logout')
  async logout(
    @AuthUser() payloadUser: any,
  ): Promise<SuccessResponseInterface> {
    try {
      await this.authService.logout(payloadUser);

      return ApiResource.successResponse();
    } catch (error) {
      ApiResource.errorResponse(error);
    }
  }
}
