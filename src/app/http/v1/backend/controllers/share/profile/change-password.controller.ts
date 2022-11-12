import { Controller, Patch, Body } from '@nestjs/common';
import { AuthUser } from '@decorators/backend/auth-user.decorator';
import { UserService } from '@services/backend/share/user.service';
import { ChangePasswordDto } from '@dtos/v1/backend/share/profile/change-password.dto';
import {
  ApiResource,
  SuccessResponseInterface,
} from 'src/app/http/resources/api.resource';

@Controller({ path: 'v1/backend/me' })
export class ProfileChangePasswordController {
  constructor(private readonly userService: UserService) {}

  /**
   * @param payloadUser
   * @param changePasswordDto
   * @returns
   */
  @Patch('password')
  async changePassword(
    @AuthUser() payloadUser: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<SuccessResponseInterface> {
    try {
      await this.userService.changePassword(payloadUser, changePasswordDto);

      return ApiResource.successResponse();
    } catch (error) {
      ApiResource.errorResponse(error);
    }
  }
}
