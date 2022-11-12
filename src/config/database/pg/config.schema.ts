import * as Joi from 'joi';

export const PgConfigSchema = Joi.object({
  POSTGRES_HOST: Joi.string().default('127.0.0.1'),
  POSTGRES_PORT: Joi.number().default(5432),
  POSTGRES_DATABASE: Joi.string().required(),
  POSTGRES_USERNAME: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
});
