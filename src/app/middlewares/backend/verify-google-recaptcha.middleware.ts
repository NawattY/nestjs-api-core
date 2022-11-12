import { RecaptchaException } from '@exceptions/app/recaptcha.exception';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { GoogleRecaptchaValidator } from '@nestlab/google-recaptcha';
import { Request, Response, NextFunction } from 'express';
import { GoogleRecaptchaConfigService } from 'src/config/google-recaptcha/config.service';

@Injectable()
export class VerifyGoogleRecaptcha implements NestMiddleware {
  constructor(
    private readonly recaptchaValidator: GoogleRecaptchaValidator,
    private config: GoogleRecaptchaConfigService,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const score = this.config.score;
    const recaptchaToken = req.headers?.recaptcha
      ? req.headers.recaptcha
      : req.body?.recaptchaToken;

    if (!recaptchaToken) {
      throw RecaptchaException.notFound();
    }

    const response = await this.recaptchaValidator.validate({
      response: recaptchaToken,
      score: this.config.score,
    });

    if (!response.success || response.score < score) {
      throw RecaptchaException.requestRecaptchaTokenInvalid();
    }

    next();
  }
}
