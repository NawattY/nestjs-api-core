import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudWatchConfigSchema } from './config.schema';
import { CloudWatchConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: CloudWatchConfigSchema,
    }),
  ],
  providers: [CloudWatchConfigService],
  exports: [CloudWatchConfigService],
})
export class CloudWatchConfigModule {}
