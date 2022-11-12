import { registerAs } from '@nestjs/config';

export default registerAs('googleRecaptcha', () => ({
  secretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
  score: process.env.GOOGLE_RECAPTCHA_SCORE,
}));
