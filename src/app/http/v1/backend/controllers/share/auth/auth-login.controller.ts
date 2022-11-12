import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@services/backend/share/auth.service';
import { AuthLoginDto } from '@dtos/v1/backend/share/auth/auth-login.dto';
import { AuthResource } from '@resources/backend/share/auth/auth.resource';

@Controller({ path: 'v1/backend/auth' })
export class AuthLoginController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() validateAuthLoginDto: AuthLoginDto,
  ): Promise<AuthResource> {
    try {
      const user = await this.authService.login(validateAuthLoginDto);

      return AuthResource.successResponse(user);
    } catch (error) {
      AuthResource.errorResponse(error);
    }
  }
}
