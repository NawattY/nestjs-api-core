import * as Joi from 'joi';

export const GraylogConfigSchema = Joi.object({
  GRAYLOG_HOST: Joi.string().default('127.0.0.1'),
  GRAYLOG_PORT: Joi.number().default(12201),
  GRAYLOG_FACILITY: Joi.string().default('smartRestaurantApi'),
});
