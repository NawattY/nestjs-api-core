import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  db:
    process.env.REDIS_DB && process.env.REDIS_DB.length
      ? process.env.REDIS_DB
      : 0,
  password:
    process.env.REDIS_PASSWORD && process.env.REDIS_PASSWORD.length
      ? process.env.REDIS_PASSWORD
      : null,
  cacheDb:
    process.env.REDIS_CACHE_DB && process.env.REDIS_CACHE_DB.length
      ? process.env.REDIS_CACHE_DB
      : 0,
}));
