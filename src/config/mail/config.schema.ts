import * as Joi from 'joi';

export const MailConfigSchema = Joi.object({
  MAIL_MAILER: Joi.string().default('smtp'),
  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().default(2525),
  MAIL_USERNAME: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().required(),
  MAIL_FROM: Joi.string().default('smart_restaurant@cpmatch.com'),
});
