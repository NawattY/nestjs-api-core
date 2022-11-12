import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('REDIS_HOST');
  }

  get port(): number {
    return +this.configService.get<number>('REDIS_PORT') || 6379;
  }

  get password(): string {
    return this.configService.get<string>('REDIS_PASSWORD');
  }

  get db(): number {
    return +this.configService.get<number>('REDIS_DB') || 0;
  }

  get cacheDb(): number {
    return +this.configService.get<number>('REDIS_CACHE_DB') || 0;
  }
}
