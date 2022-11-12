import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraylogConfigSchema } from './config.schema';
import { GraylogConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: GraylogConfigSchema,
    }),
  ],
  providers: [GraylogConfigService],
  exports: [GraylogConfigService],
})
export class GraylogConfigModule {}
