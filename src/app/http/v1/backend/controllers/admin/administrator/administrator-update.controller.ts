import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { AdministratorService } from '@services/backend/admin/administrator.service';
import { UserResource } from '@resources/backend/share/user/user.resource';
import { AdministratorUpdateDto } from '@dtos/v1/backend/admin/administrator/administrator-update.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { FormDataRequestInterceptor } from 'src/app/common/interceptors/form-data-request.interceptor';

@Controller({ path: 'v1/backend/admin/administrators' })
export class AdministratorUpdateController {
  constructor(private readonly administratorService: AdministratorService) {}

  @Patch(':id')
  @UseInterceptors(FormDataRequestInterceptor)
  @FormDataRequest()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() validateUserDto: AdministratorUpdateDto,
  ): Promise<UserResource> {
    try {
      const user = await this.administratorService.update(id, validateUserDto);

      return UserResource.successResponse(user);
    } catch (error) {
      UserResource.errorResponse(error);
    }
  }
}
