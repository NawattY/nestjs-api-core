import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from '@services/backend/share/auth.service';
import { AuthUser } from '@decorators/backend/auth-user.decorator';
import { UserResource } from '@resources/backend/share/user/user.resource';

@Controller({ path: 'v1/backend/me' })
export class ProfileGetController {
  constructor(private readonly service: AuthService) {}

  /**
   * @param payloadUser
   * @param query
   * @returns
   */
  @Get('/')
  async getProfile(
    @AuthUser() payloadUser: any,
    @Query() query?: any,
  ): Promise<UserResource> {
    try {
      const user = await this.service.findById(payloadUser.id, query);

      return UserResource.successResponse(user);
    } catch (error) {
      UserResource.errorResponse(error);
    }
  }
}
