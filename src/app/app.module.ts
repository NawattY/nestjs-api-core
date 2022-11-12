import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionFilter } from '@exceptions/exception.filter';
import { RouteProviderModule } from './providers/route/provider.module';
import {
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { AppConfigModule } from 'src/config/app/config.module';
import { CloudWatchProviderModule } from '@providers/logger/cloudwatch/provider.module';

@Module({
  imports: [
    RouteProviderModule,
    AppConfigModule,
    CloudWatchProviderModule,
    I18nModule.forRoot({
      fallbackLanguage: 'th',
      loaderOptions: {
        path: path.join('src/lang/'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang']),
        new HeaderResolver(['x-locale']),
        new CookieResolver(),
      ],
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export class AppModule {}
