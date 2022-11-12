import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigProviderModule } from '@providers/config/provider.module';
import { QueueRedisProviderModule } from '@providers/queue/redis/provider.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApiLoggerInterceptor } from 'src/app/common/interceptors/api-logger.interceptor';
import { DatabasePgProviderModule } from '@providers/database/pg/provider.module';
import { InitialMerchantConnection } from '@middlewares/backend/initial-merchant-connection.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantService as AdminMerchantService } from '@services/backend/admin/merchant.service';
import { MerchantService } from '@services/backend/merchant/merchant.service';
import { MerchantEntity } from '@entities/default/merchant.entity';
import { UserEntity } from 'src/app/entities/default/user.entity';
import { PassportJwtProviderModule } from '@providers/passport/jwt/provider.module';
import { AuthService } from '@services/backend/share/auth.service';
import { MerchantConnectionEntity } from '@entities/default/merchant-connections.entity';
import { BannerService } from '@services/backend/merchant/banner.service';
import { BannerEntity } from '@entities/tenant/banner.entity';
import BannerController from '@controller/v1/backend/merchant/banner';
import { MerchantConnectionProviderModule } from '@providers/merchant-connection/provider.module';
import { AuthAccessTokenEntity } from 'src/app/entities/default/auth-access-token.entity';
import { AuthRefreshTokenEntity } from 'src/app/entities/default/auth-refresh-token.entity';
import AdministratorController from '@controller/v1/backend/admin/administrator';
import { AuthMiddleware } from '@middlewares/backend/auth.middleware';
import { AdminMiddleware } from '@middlewares/backend/admin.middleware';
import AuthController from '@controller/v1/backend/share/auth';
import MerchantController from '@controller/v1/backend/admin/merchant';
import { S3ProviderModule } from '@providers/filesystems/s3/provider.module';
import { AdministratorService } from '@services/backend/admin/administrator.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { TenantsService } from 'src/app/tenancy/tenancy.service';
import { S3Service } from '@appotter/nestjs-s3';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@services/backend/share/user.service';
import { CreateThumbnailProvider } from '@providers/filesystems/s3/create-thumbnail.provider';
import { InitialLocale } from '@middlewares/backend/initial-locale.middleware';
import BranchController from './controllers/merchant/branch';
import { BranchService } from '@services/backend/merchant/branch.service';
import { SupportLocaleController } from './controllers/merchant/support-locale.controller';
import { SupportLocaleService } from '@services/backend/merchant/support-locale.service';
import { MerchantInformationController } from './controllers/merchant/merchant-information.controller';
import { CloudWatchProviderModule } from '@providers/logger/cloudwatch/provider.module';
import { AccessMerchantController } from './controllers/admin/access-merchant.controller';
import { UpdateLocaleController } from './controllers/merchant/update-locale.controller';
import { CacheRedisProviderModule } from '@providers/cache/redis/provider.module';
import PasswordResetController from './controllers/share/password-reset';
import { UserSecurityCodeEntity } from '@entities/default/user-security-codes.entity';
import { UpdateTemplateController } from './controllers/merchant/update-template.controller';
import CategoryController from '@controller/v1/backend/merchant/category';
import { CategoryService } from '@services/backend/merchant/category.service';
import ProductController from '@controller/v1/backend/merchant/product';
import { ProductService } from '@services/backend/merchant/product.service';
import { PasswordResetService } from '@services/backend/share/password-reset.service';
import { MailService } from '@providers/mail/mail.service';
import { MailModule } from '@providers/mail/mail.module';
import { DefaultLocaleValidator } from 'src/app/common/validators/default-locale.validator';
import { UploadFile } from '@helpers/upload-file.helper';
import { GoogleRecaptchaProviderModule } from '@providers/google-recaptcha/provider.module';
import { VerifyGoogleRecaptcha } from '@middlewares/backend/verify-google-recaptcha.middleware';
import ProfileController from '@controller/v1/backend/share/profile';
import { AppendBranch } from '@middlewares/backend/append-branch.middleware';
import BranchBannerController from '@controller/v1/backend/merchant/branch-banner';
import { BranchBannerService } from '@services/backend/merchant/branch-banner.service';
import BranchProductController from '@controller/v1/backend/merchant/branch-product';
import { BranchProductService } from '@services/backend/merchant/branch-product.service';
import BranchCategoryController from '@controller/v1/backend/merchant/branch-category';
import { BranchCategoryService } from '@services/backend/merchant/branch-category.service';
import qrCodeController from './controllers/merchant/qr-code';
import { QrCodeService } from '@services/backend/merchant/qr-code.service';

@Module({
  imports: [
    CacheRedisProviderModule,
    ConfigProviderModule,
    DatabasePgProviderModule,
    QueueRedisProviderModule,
    CloudWatchProviderModule,
    S3ProviderModule,
    PassportJwtProviderModule,
    MerchantConnectionProviderModule,
    NestjsFormDataModule,
    MailModule,
    GoogleRecaptchaProviderModule,
    TypeOrmModule.forFeature([
      UserEntity,
      MerchantEntity,
      MerchantConnectionEntity,
      BannerEntity,
      AuthAccessTokenEntity,
      AuthRefreshTokenEntity,
      UserSecurityCodeEntity,
    ]),
  ],
  controllers: [
    ...AuthController,
    ...AdministratorController,
    ...MerchantController,
    ...BranchController,
    ...PasswordResetController,
    ...CategoryController,
    ...ProductController,
    ...ProfileController,
    ...BannerController,
    ...BranchBannerController,
    ...BranchProductController,
    ...BranchCategoryController,
    ...qrCodeController,
    SupportLocaleController,
    AccessMerchantController,
    MerchantInformationController,
    UpdateLocaleController,
    UpdateTemplateController,
  ],
  providers: [
    AdministratorService,
    AdminMerchantService,
    AuthService,
    MerchantService,
    BannerService,
    SupportLocaleService,
    TenantsService,
    BranchService,
    CategoryService,
    ProductService,
    PasswordResetService,
    BranchBannerService,
    BranchProductService,
    BranchCategoryService,
    ConfigService,
    QrCodeService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiLoggerInterceptor,
    },
    S3Service,
    UserService,
    CreateThumbnailProvider,
    DefaultLocaleValidator,
    MailService,
    UploadFile,
  ],
  exports: [],
})
export class BackendModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('v1/backend/auth/login', 'v1/backend/password-reset(.*)')
      .forRoutes({ path: 'v1/backend/*', method: RequestMethod.ALL });

    consumer.apply(AdminMiddleware).forRoutes({
      path: 'v1/backend/admin/*',
      method: RequestMethod.ALL,
    });

    consumer
      .apply(InitialMerchantConnection)
      .exclude(
        'v1/backend/admin/(.*)',
        'v1/backend/auth/login',
        'v1/backend/auth/logout',
        'v1/backend/me',
        'v1/backend/me/password',
        'v1/backend/password-reset(.*)',
      )
      .forRoutes({ path: 'v1/backend/*', method: RequestMethod.ALL });

    consumer
      .apply(InitialLocale)
      .forRoutes({ path: 'v1/backend/*', method: RequestMethod.ALL });

    consumer.apply(AppendBranch).forRoutes(
      { path: 'v1/backend/merchant/branch-*', method: RequestMethod.ALL },
      {
        path: 'v1/backend/merchant/qr-code/digital-menu',
        method: RequestMethod.ALL,
      },
    );

    consumer.apply(VerifyGoogleRecaptcha).forRoutes({
      path: 'v1/backend/password-reset/request',
      method: RequestMethod.ALL,
    });
  }
}
