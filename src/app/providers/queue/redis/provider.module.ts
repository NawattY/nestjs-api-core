import {
  BullModule,
  BullRootModuleOptions,
  SharedBullAsyncConfiguration,
} from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigProviderModule } from '@providers/config/provider.module';
import { AppConfigService } from 'src/config/app/config.service';
import { RedisConfigService } from 'src/config/database/redis/config.service';
import * as Bull from 'bull';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigProviderModule],
      inject: [RedisConfigService, AppConfigService],
      useFactory: (
        redisConfigService: RedisConfigService,
        appConfigService: AppConfigService,
      ): BullRootModuleOptions | Bull.QueueOptions => ({
        prefix: appConfigService.name,
        redis: {
          host: redisConfigService.host,
          port: redisConfigService.port,
          password: redisConfigService.password,
          db: redisConfigService.db,
        },
        defaultJobOptions: {
          removeOnComplete: true,
        },
      }),
    } as SharedBullAsyncConfiguration),
    BullModule.registerQueue({
      name: 'default',
    }),
  ],
  exports: [BullModule],
})
export class QueueRedisProviderModule {}
