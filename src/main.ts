import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AppConfigService } from 'src/config/app/config.service';
import { ValidationPipe } from '@nestjs/common';
import { i18nValidationErrorFactory } from 'nestjs-i18n';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: i18nValidationErrorFactory,
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.enableCors();

  await app.init();
  const appConfigService = app.get<AppConfigService>(AppConfigService);

  await app.listen(appConfigService.port, appConfigService.host);
}
bootstrap();
