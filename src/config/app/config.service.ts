import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('APP_HOST') || '127.0.0.1';
  }

  get name(): string {
    return this.configService.get<string>('APP_NAME');
  }

  get url(): string {
    return this.configService.get<string>('APP_URL');
  }

  get port(): number {
    return +this.configService.get<number>('APP_PORT') || 3000;
  }

  get isTesting(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'test';
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  get accessTokenExpiredIn(): number {
    return +(
      this.configService.get<number>('AUTH_ACCESS_TOKEN_EXPIRE_MIN') || 30
    );
  }

  get refreshTokenExpiredIn(): number {
    return +(
      this.configService.get<number>('AUTH_REFRESH_TOKEN_EXPIRE_MIN') || 60
    );
  }

  get httpLogEnabled(): boolean {
    const config = this.configService.get<boolean>('HTTP_LOG_ENABLED');

    if (typeof config === 'boolean') {
      return config;
    }

    if (typeof config === 'string') {
      return config === 'true' ? true : false;
    }

    return false;
  }

  get exceptionLogEnabled(): boolean {
    const config = this.configService.get<boolean>('EXCEPTION_LOG_ENABLED');

    if (typeof config === 'boolean') {
      return config;
    }

    if (typeof config === 'string') {
      return config === 'true' ? true : false;
    }

    return false;
  }

  get hashKey(): string {
    return this.configService.get<string>('HASH_KEY');
  }

  get backendUrl(): string {
    return this.configService.get<string>('APP_BACKEND_URL');
  }

  get frontendUrl(): string {
    return this.configService.get<string>('APP_FRONTEND_URL');
  }

  get passwordResetTokenExpiredMinute(): number {
    return this.configService.get<number>(
      'PASSWORD_RESET_TOKEN_EXPIRED_MINUTES',
    );
  }
}
