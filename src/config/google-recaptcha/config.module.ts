import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleRecaptchaConfigSchema } from './config.schema';
import { GoogleRecaptchaConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: GoogleRecaptchaConfigSchema,
    }),
  ],
  providers: [GoogleRecaptchaConfigService],
  exports: [GoogleRecaptchaConfigService],
})
export class GoogleRecaptchaConfigModule {}
