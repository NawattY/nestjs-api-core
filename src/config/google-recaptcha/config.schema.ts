import * as Joi from 'joi';

export const GoogleRecaptchaConfigSchema = Joi.object({
  GOOGLE_RECAPTCHA_SECRET_KEY: Joi.string().required(),
  GOOGLE_RECAPTCHA_SCORE: Joi.number().default(0.5),
});
