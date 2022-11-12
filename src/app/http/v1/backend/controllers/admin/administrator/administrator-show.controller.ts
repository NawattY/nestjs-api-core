import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AdministratorService } from '@services/backend/admin/administrator.service';
import { UserResource } from '@resources/backend/share/user/user.resource';

@Controller({ path: 'v1/backend/admin/administrators' })
export class AdministratorShowController {
  constructor(private readonly administratorService: AdministratorService) {}

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number): Promise<UserResource> {
    try {
      const data = await this.administratorService.findById(id);

      return UserResource.successResponse(data);
    } catch (error) {
      return UserResource.errorResponse(error);
    }
  }
}
