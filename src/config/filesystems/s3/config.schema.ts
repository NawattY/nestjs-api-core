import * as Joi from 'joi';

export const S3ConfigSchema = Joi.object({
  AWS_S3_URL: Joi.string().required(),
  AWS_S3_ACCESS_KEY_ID: Joi.string().required(),
  AWS_S3_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_S3_REGION: Joi.string().required(),
  AWS_S3_BUCKET: Joi.string().required(),
  AWS_S3_ACL: Joi.string().default('public-read'),
});
