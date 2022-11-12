import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigSchema } from './config.schema';
import { AppConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: AppConfigSchema,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
