import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('MAIL_HOST');
  }

  get port(): string {
    return this.configService.get<string>('MAIL_PORT');
  }

  get username(): string {
    return this.configService.get<string>('MAIL_USERNAME');
  }

  get password(): string {
    return this.configService.get<string>('MAIL_PASSWORD');
  }

  get from(): string {
    return this.configService.get<string>('MAIL_FROM');
  }
}
