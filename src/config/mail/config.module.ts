import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailConfigSchema } from './config.schema';
import { MailConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: MailConfigSchema,
    }),
  ],
  providers: [MailConfigService],
  exports: [MailConfigService],
})
export class MailConfigModule {}
