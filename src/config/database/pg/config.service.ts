import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PgConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('POSTGRES_HOST');
  }

  get port(): number {
    return +this.configService.get<number>('POSTGRES_PORT') || 5432;
  }

  get database(): string {
    return this.configService.get<string>('POSTGRES_DATABASE');
  }

  get username(): string {
    return this.configService.get<string>('POSTGRES_USERNAME');
  }

  get password(): string {
    return this.configService.get<string>('POSTGRES_PASSWORD');
  }
}
