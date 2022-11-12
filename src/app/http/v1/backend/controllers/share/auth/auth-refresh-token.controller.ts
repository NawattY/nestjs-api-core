import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@services/backend/share/auth.service';
import { ApiResource } from 'src/app/http/resources/api.resource';
import { AuthRefreshDto } from '@dtos/v1/backend/share/auth/auth-refresh.dto';

@Controller({ path: 'v1/backend/auth-refresh' })
export class AuthRefreshTokenController {
  constructor(private readonly authService: AuthService) {}

  @Post('/')
  async refreshToken(
    @Body() authRefreshDto: AuthRefreshDto,
  ): Promise<ApiResource> {
    try {
      const data = await this.authService.refreshToken(
        authRefreshDto.refreshToken,
      );

      return ApiResource.successResponse(data);
    } catch (error) {
      ApiResource.errorResponse(error);
    }
  }
}
