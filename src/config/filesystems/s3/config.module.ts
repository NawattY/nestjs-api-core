import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3ConfigSchema } from './config.schema';
import { S3ConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: S3ConfigSchema,
    }),
  ],
  providers: [S3ConfigService],
  exports: [S3ConfigService],
})
export class S3ConfigModule {}
