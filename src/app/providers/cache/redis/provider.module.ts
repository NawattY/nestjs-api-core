import {
  CacheModule,
  CacheModuleAsyncOptions,
  CacheModuleOptions,
  Module,
} from '@nestjs/common';
import { ConfigProviderModule } from '@providers/config/provider.module';
import { RedisConfigService } from 'src/config/database/redis/config.service';
import * as RedisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigProviderModule],
      inject: [RedisConfigService],
      useFactory: (
        redisConfigService: RedisConfigService,
      ): CacheModuleOptions => {
        const config = {
          store: RedisStore,
          host: redisConfigService.host,
          port: redisConfigService.port,
          db: redisConfigService.cacheDb,
        };

        if (redisConfigService.password) {
          config['password'] = redisConfigService.password;
        }

        return config;
      },
    } as CacheModuleAsyncOptions),
  ],
  exports: [CacheModule],
})
export class CacheRedisProviderModule {}
