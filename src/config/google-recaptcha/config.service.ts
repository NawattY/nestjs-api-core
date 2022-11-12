import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleRecaptchaConfigService {
  constructor(private configService: ConfigService) {}

  get secretKey(): string {
    return this.configService.get<string>('GOOGLE_RECAPTCHA_SECRET_KEY');
  }

  get score(): number {
    return +this.configService.get<number>('GOOGLE_RECAPTCHA_SCORE') || 0.5;
  }
}
