import { Module, Scope } from '@nestjs/common';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantConnectionEntity } from '@entities/default/merchant-connections.entity';
import { TenantsService } from 'src/app/tenancy/tenancy.service';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantConnectionEntity])],
  providers: [
    JwtService,
    TenantsService,
    {
      provide: MERCHANT_CONNECTION,
      inject: [REQUEST, JwtService, TenantsService],
      scope: Scope.REQUEST,
      useFactory: async (
        request: Request,
        jwtService: JwtService,
        tenantsService: TenantsService,
      ) => {
        const merchantId = request.merchantId;

        return tenantsService.setTenantConnection(merchantId);
      },
    },
  ],
  exports: [MERCHANT_CONNECTION],
})
export class MerchantConnectionProviderModule {}
