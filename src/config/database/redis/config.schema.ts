import * as Joi from 'joi';

export const RedisConfigSchema = Joi.object({
  REDIS_HOST: Joi.string().default('127.0.0.1'),
  REDIS_PORT: Joi.number().default(6379),
  // REDIS_PASSWORD: Joi.string().default(''),
  REDIS_DB: Joi.number().default(0),
  REDIS_CACHE_DB: Joi.number().default(0),
});
