import { Controller, Patch, UseInterceptors, Body } from '@nestjs/common';
import { AuthUser } from '@decorators/backend/auth-user.decorator';
import { UserResource } from '@resources/backend/share/user/user.resource';
import { FormDataRequestInterceptor } from 'src/app/common/interceptors/form-data-request.interceptor';
import { FormDataRequest } from 'nestjs-form-data';
import { ProfileUpdateDto } from '@dtos/v1/backend/share/profile/profile-update.dto';
import { UserService } from '@services/backend/share/user.service';

@Controller({ path: 'v1/backend/me' })
export class ProfileUpdateController {
  constructor(private readonly userService: UserService) {}

  /**
   * @param payloadUser
   * @param profileUpdateDto
   * @returns
   */
  @Patch('/')
  @UseInterceptors(FormDataRequestInterceptor)
  @FormDataRequest()
  async update(
    @AuthUser() payloadUser: any,
    @Body() profileUpdateDto: ProfileUpdateDto,
  ): Promise<UserResource> {
    try {
      const user = await this.userService.modify(payloadUser, profileUpdateDto);

      return UserResource.successResponse(user);
    } catch (error) {
      UserResource.errorResponse(error);
    }
  }
}
