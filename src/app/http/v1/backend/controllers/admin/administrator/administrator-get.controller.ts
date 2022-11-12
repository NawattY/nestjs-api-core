import { Controller, Get, Query } from '@nestjs/common';
import { UserResource } from '@resources/backend/share/user/user.resource';
import { AdministratorService } from '@services/backend/admin/administrator.service';

@Controller({ path: 'v1/backend/admin/administrators' })
export class AdministratorGetController {
  constructor(private readonly administratorService: AdministratorService) {}

  @Get('/')
  async get(@Query() query: any): Promise<UserResource> {
    try {
      const user = await this.administratorService.get(query);

      return UserResource.successResponse(user);
    } catch (error) {
      return UserResource.errorResponse(error);
    }
  }
}
