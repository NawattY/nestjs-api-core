import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AdministratorService } from '@services/backend/admin/administrator.service';
import { UserResource } from '@resources/backend/share/user/user.resource';
import { AdministratorStoreDto } from '@dtos/v1/backend/admin/administrator/administrator-store.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { FormDataRequestInterceptor } from 'src/app/common/interceptors/form-data-request.interceptor';

@Controller({ path: 'v1/backend/admin/administrators' })
export class AdministratorStoreController {
  constructor(private readonly administratorService: AdministratorService) {}

  @Post('/')
  @UseInterceptors(FormDataRequestInterceptor)
  @FormDataRequest()
  async store(
    @Body() validateUserDto: AdministratorStoreDto,
  ): Promise<UserResource> {
    try {
      const user = await this.administratorService.store(validateUserDto);

      return UserResource.successResponse(user);
    } catch (error) {
      UserResource.errorResponse(error);
    }
  }
}
