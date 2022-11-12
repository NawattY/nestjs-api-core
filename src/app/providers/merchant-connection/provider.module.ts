import { Module, Scope } from '@nestjs/common';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { getConnection } from 'typeorm';
import { isEmpty, get } from 'lodash';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantConnectionEntity } from '@entities/default/merchant-connections.entity';
import { UserType } from '@enums/user-type';
import { decodeId } from '@helpers/hash-id.helper';
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
        const authorization = request.header('authorization');

        if (isEmpty(authorization)) {
          return getConnection();
        }

        let merchantId = parseInt(get(request.user, 'merchantId'));
        if (get(request.user, 'type') === UserType.ADMIN) {
          merchantId = decodeId(request.header('x-merchant')) as number;

          if (!merchantId) {
            return getConnection();
          }
        }

        return tenantsService.setTenantConnection(merchantId);
      },
    },
  ],
  exports: [MERCHANT_CONNECTION],
})
export class MerchantConnectionProviderModule {}
