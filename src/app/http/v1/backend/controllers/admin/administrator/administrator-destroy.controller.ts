import { AuthUser } from '@decorators/backend/auth-user.decorator';
import { UserEntity } from '@entities/default/user.entity';
import { Controller, Delete, Param } from '@nestjs/common';
import { AdministratorService } from '@services/backend/admin/administrator.service';
import { ApiResource } from 'src/app/http/resources/api.resource';

@Controller({ path: 'v1/backend/admin/administrators' })
export class AdministratorDestroyController {
  constructor(private readonly administratorService: AdministratorService) {}

  @Delete(':id')
  async destroy(
    @Param('id') id: number,
    @AuthUser() authUser: UserEntity,
  ): Promise<ApiResource> {
    try {
      await this.administratorService.destroy(id, authUser);

      return ApiResource.successResponse();
    } catch (error) {
      ApiResource.errorResponse(error);
    }
  }
}
