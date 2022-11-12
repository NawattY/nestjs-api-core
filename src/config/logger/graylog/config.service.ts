import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GraylogConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('GRAYLOG_HOST') || '127.0.0.1';
  }

  get port(): number {
    return +this.configService.get<number>('GRAYLOG_PORT') || 12201;
  }

  get facility(): string {
    return (
      this.configService.get<string>('GRAYLOG_FACILITY') || 'smartRestaurantApi'
    );
  }
}
