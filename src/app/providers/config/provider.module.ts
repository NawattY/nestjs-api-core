import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/config/app/config.module';
import { RedisConfigModule } from 'src/config/database/redis/config.module';
import { S3ConfigModule } from 'src/config/filesystems/s3/config.module';
import { PgConfigModule } from 'src/config/database/pg/config.module';
import { MongoConfigModule } from 'src/config/database/mongo/config.module';
import { CloudWatchConfigModule } from 'src/config/logger/cloudwatch/config.module';
import { MailConfigModule } from 'src/config/mail/config.module';
import { GoogleRecaptchaConfigModule } from 'src/config/google-recaptcha/config.module';

@Module({
  imports: [
    AppConfigModule,
    PgConfigModule,
    RedisConfigModule,
    MongoConfigModule,
    S3ConfigModule,
    CloudWatchConfigModule,
    MailConfigModule,
    GoogleRecaptchaConfigModule,
  ],
  exports: [
    AppConfigModule,
    PgConfigModule,
    RedisConfigModule,
    MongoConfigModule,
    S3ConfigModule,
    CloudWatchConfigModule,
    MailConfigModule,
    GoogleRecaptchaConfigModule,
  ],
})
export class ConfigProviderModule {}
