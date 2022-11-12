import * as path from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigProviderModule } from '@providers/config/provider.module';
import { MailConfigService } from 'src/config/mail/config.service';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CloudWatchProviderModule } from '@providers/logger/cloudwatch/provider.module';
import { CloudWatchLogger } from '@providers/logger/cloudwatch/provider.service';

@Module({
  imports: [
    ConfigProviderModule,
    CloudWatchProviderModule,
    MailerModule.forRootAsync({
      imports: [ConfigProviderModule],
      inject: [MailConfigService],
      useFactory: (config: MailConfigService) => ({
        transport: {
          host: config.host,
          secure: false,
          auth: {
            user: config.username,
            pass: config.password,
          },
        },
        defaults: {
          from: config.from,
        },
        template: {
          dir: path.join('src/templates/'),
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService, CloudWatchLogger],
  exports: [MailService],
})
export class MailModule {}
