import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigProviderModule } from '@providers/config/provider.module';
import { AppConfigService } from 'src/config/app/config.service';
import {
  JwtModule,
  JwtModuleOptions,
  JwtModuleAsyncOptions,
} from '@nestjs/jwt';
import { JwtStrategy } from 'src/app/strategies/jwt-strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/app/entities/default/user.entity';

@Module({
  imports: [
    ConfigProviderModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigProviderModule],
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService): JwtModuleOptions => ({
        secret: appConfigService.jwtSecret,
        signOptions: {
          expiresIn: appConfigService.accessTokenExpiredIn,
        },
      }),
    } as JwtModuleAsyncOptions),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [JwtStrategy],
  exports: [PassportModule, JwtModule, JwtStrategy],
})
export class PassportJwtProviderModule {}
