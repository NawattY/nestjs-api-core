import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudWatchConfigService {
  constructor(private configService: ConfigService) {}

  get accessKeyId(): string {
    return this.configService.get<string>('AWS_CLOUDWATCH_ACCESS_KEY_ID');
  }

  get secretAccessKey(): string {
    return this.configService.get<string>('AWS_CLOUDWATCH_SECRET_ACCESS_KEY');
  }

  get region(): string {
    return this.configService.get<string>('AWS_CLOUDWATCH_REGION');
  }

  get logGroupName(): string {
    return this.configService.get<string>('AWS_CLOUDWATCH_LOG_GROUP_NAME');
  }

  get logStreamName(): string {
    return this.configService.get<string>('AWS_CLOUDWATCH_LOG_STREAM_NAME');
  }
}
