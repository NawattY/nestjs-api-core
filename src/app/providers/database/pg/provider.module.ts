import { Module } from '@nestjs/common';
import {
  TypeOrmModule,
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppConfigService } from 'src/config/app/config.service';
import { PgConfigService } from 'src/config/database/pg/config.service';
import { ConfigProviderModule } from '../../config/provider.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigProviderModule],
      inject: [AppConfigService, PgConfigService],
      useFactory: (
        appConfigService: AppConfigService,
        pgConfigService: PgConfigService,
      ): TypeOrmModuleOptions =>
        appConfigService.isTesting
          ? {
              type: 'sqlite',
              database: ':memory:',
              entities: ['**/*.entity.ts'],
              synchronize: true,
              migrationsRun: false,
              migrations: ['src/database/migrations/**/*.js'],
              namingStrategy: new SnakeNamingStrategy(),
            }
          : {
              type: 'postgres',
              host: pgConfigService.host,
              port: pgConfigService.port,
              username: pgConfigService.username,
              password: pgConfigService.password,
              database: pgConfigService.database,
              entities: ['**/*.entity.js'],
              synchronize: false,
              migrationsRun: false,
              migrations: ['src/database/migrations/**/*.js'],
              namingStrategy: new SnakeNamingStrategy(),
            },
    } as TypeOrmModuleAsyncOptions),
  ],
  exports: [TypeOrmModule],
})
export class DatabasePgProviderModule {}
