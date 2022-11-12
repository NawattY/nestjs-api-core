import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3ConfigService {
  constructor(private configService: ConfigService) {}

  get utl(): string {
    return this.configService.get<string>('AWS_S3_URL');
  }

  get accessKeyId(): string {
    return this.configService.get<string>('AWS_S3_ACCESS_KEY_ID');
  }

  get secretAccessKey(): string {
    return this.configService.get<string>('AWS_S3_SECRET_ACCESS_KEY');
  }

  get region(): string {
    return this.configService.get<string>('AWS_S3_REGION');
  }

  get bucket(): string {
    return this.configService.get<string>('AWS_S3_BUCKET');
  }

  get acl(): string {
    return this.configService.get<string>('AWS_S3_ACL');
  }
}
