import * as Joi from 'joi';

export const MongoConfigSchema = Joi.object({
  MONGO_DB_URI: Joi.string().required(),
});
