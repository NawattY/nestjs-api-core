import { Global, Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request as ExpressRequest } from 'express';
import { TENANT_CONNECTION } from './tenancy.symbols';
import { TenantsService } from './tenancy.service';

/**
 * Note that because of Scope Hierarchy, all injectors of this
 * provider will be request-scoped by default. Hence there is
 * no need for example to specify that a consuming tenant-level
 * service is itself request-scoped.
 * https://docs.nestjs.com/fundamentals/injection-scopes#scope-hierarchy
 */
const connectionFactory = {
  provide: TENANT_CONNECTION,
  scope: Scope.REQUEST,
  useFactory: async (
    request: ExpressRequest,
    tenantsService: TenantsService,
  ) => {
    const merchantId = parseInt(request.get('merchantId'));

    if (merchantId) {
      try {
        return await tenantsService.setTenantConnection(merchantId);
      } catch (error) {}
    }

    return null;
  },
  inject: [REQUEST],
};

@Global()
@Module({
  providers: [connectionFactory, TenantsService],
  exports: [TENANT_CONNECTION],
})
export class TenancyModule {}
