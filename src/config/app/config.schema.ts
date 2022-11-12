import * as Joi from 'joi';

export const AppConfigSchema = Joi.object({
  APP_HOST: Joi.string().default('127.0.0.1'),
  APP_NAME: Joi.string().default('smartRestaurantApi'),
  APP_URL: Joi.string().required(),
  APP_PORT: Joi.number().default(3005),
  JWT_SECRET: Joi.string().required(),
  AUTH_ACCESS_TOKEN_EXPIRE_MIN: Joi.number().default(30),
  AUTH_REFRESH_TOKEN_EXPIRE_MIN: Joi.number().default(1440),
  HTTP_LOG_ENABLED: Joi.boolean().default(false).valid(true, false),
  EXCEPTION_LOG_ENABLED: Joi.boolean().default(false).valid(true, false),
  HASH_KEY: Joi.string().default('smart-restaurant-api-hash-key'),
  APP_BACKEND_URL: Joi.string(),
  APP_FRONTEND_URL: Joi.string(),
  PASSWORD_RESET_TOKEN_EXPIRED_MINUTES: Joi.number().default(15),
});
