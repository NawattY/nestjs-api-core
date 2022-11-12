import { Module } from '@nestjs/common';
import { ConfigProviderModule } from '@providers/config/provider.module';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { GoogleRecaptchaConfigService } from 'src/config/google-recaptcha/config.service';
import { IncomingMessage } from 'http';

@Module({
  imports: [
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigProviderModule],
      inject: [GoogleRecaptchaConfigService],
      useFactory: (recaptchaConfigService: GoogleRecaptchaConfigService) => ({
        secretKey: recaptchaConfigService.secretKey,
        response: (req: IncomingMessage) =>
          (req.headers.recaptcha || '').toString(),
        score: recaptchaConfigService.score,
      }),
    }),
  ],
  exports: [GoogleRecaptchaModule],
})
export class GoogleRecaptchaProviderModule {}
