import { Module } from '@nestjs/common';
import {
  S3Module,
  S3ModuleOptions,
  S3ModuleOptionsAsync,
  S3Service,
} from '@appotter/nestjs-s3';
import { ConfigProviderModule } from '@providers/config/provider.module';
import { S3ConfigService } from 'src/config/filesystems/s3/config.service';

@Module({
  imports: [
    S3Module.registerAsync({
      imports: [ConfigProviderModule],
      inject: [S3ConfigService],
      useFactory: (s3ConfigService: S3ConfigService): S3ModuleOptions => ({
        accessKeyId: s3ConfigService.accessKeyId,
        secretAccessKey: s3ConfigService.secretAccessKey,
        region: s3ConfigService.region,
        bucket: s3ConfigService.bucket,
        acl: s3ConfigService.acl,
      }),
    } as S3ModuleOptionsAsync),
  ],
  providers: [S3Service],
  exports: [S3Module],
})
export class S3ProviderModule {}
