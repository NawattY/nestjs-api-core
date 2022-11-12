import * as Joi from 'joi';

export const CloudWatchConfigSchema = Joi.object({
  AWS_CLOUDWATCH_ACCESS_KEY_ID: Joi.string().required(),
  AWS_CLOUDWATCH_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_CLOUDWATCH_REGION: Joi.string().required(),
  AWS_CLOUDWATCH_LOG_GROUP_NAME: Joi.string().required(),
  AWS_CLOUDWATCH_LOG_STREAM_NAME: Joi.string().required(),
});
