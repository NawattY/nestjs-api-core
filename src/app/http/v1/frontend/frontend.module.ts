import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InitialVerifyDomainByReferer } from '@middlewares/frontend/initial-verify-domain-by-referer.middleware';
import { MerchantEntity } from '@entities/default/merchant.entity';
import { MerchantConnectionEntity } from '@entities/default/merchant-connections.entity';
import ProductController from '@controller/v1/frontend/products';
import { ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApiLoggerInterceptor } from 'src/app/common/interceptors/api-logger.interceptor';
import { ConfigProviderModule } from '@providers/config/provider.module';
import { DatabasePgProviderModule } from '@providers/database/pg/provider.module';
import { CacheRedisProviderModule } from '@providers/cache/redis/provider.module';
import { S3ProviderModule } from '@providers/filesystems/s3/provider.module';
import { CloudWatchProviderModule } from '@providers/logger/cloudwatch/provider.module';
import { QueueRedisProviderModule } from '@providers/queue/redis/provider.module';
import { MerchantConnectionProviderModule } from '@providers/merchant-connection/frontend/provider.module';
import { InitialMerchantConnection } from '@middlewares/frontend/initial-merchant-connection.middleware';
import { MerchantService } from '@services/frontend/merchant.service';
import { BranchService } from '@services/frontend/branch.service';
import { AppendBranch } from '@middlewares/frontend/append-branch.middleware';
import { InitialLocale } from '@middlewares/frontend/initial-locale.middleware';
import { BannerEntity } from '@entities/tenant/banner.entity';
import { BannerService } from '@services/frontend/banner.service';
import BannerController from '@controller/v1/frontend/banner';
import { ProductService } from '@services/frontend/product.service';
import SettingController from '@controller/v1/frontend/settings';
import { TenantsService } from 'src/app/tenancy/tenancy.service';

@Module({
  imports: [
    CacheRedisProviderModule,
    ConfigProviderModule,
    DatabasePgProviderModule,
    QueueRedisProviderModule,
    CloudWatchProviderModule,
    MerchantConnectionProviderModule,
    S3ProviderModule,
    TypeOrmModule.forFeature([
      MerchantEntity,
      MerchantConnectionEntity,
      BannerEntity,
    ]),
  ],
  controllers: [
    ...ProductController,
    ...BannerController,
    ...SettingController,
  ],
  providers: [
    ConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiLoggerInterceptor,
    },
    TenantsService,
    MerchantService,
    BranchService,
    BannerService,
    ProductService,
  ],
})
export class FrontendModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(InitialVerifyDomainByReferer)
      .forRoutes({ path: 'v1/frontend/*', method: RequestMethod.ALL });
    consumer
      .apply(InitialMerchantConnection)
      .forRoutes({ path: 'v1/frontend/*', method: RequestMethod.ALL });
    consumer
      .apply(AppendBranch)
      .exclude('v1/frontend/settings')
      .forRoutes({ path: 'v1/frontend/*', method: RequestMethod.ALL });
    consumer
      .apply(InitialLocale)
      .forRoutes({ path: 'v1/frontend/*', method: RequestMethod.ALL });
  }
}
