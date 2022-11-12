import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisConfigSchema } from './config.schema';
import { RedisConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: RedisConfigSchema,
    }),
  ],
  providers: [RedisConfigService],
  exports: [RedisConfigService],
})
export class RedisConfigModule {}
