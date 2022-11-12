import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  host: process.env.APP_HOST,
  name: process.env.APP_NAME,
  url: process.env.APP_URL,
  port: process.env.APP_PORT,
  jwtSecret: process.env.JWT_SECRET,
  accessTokenExpiredIn: process.env.AUTH_ACCESS_TOKEN_EXPIRE_MIN,
  refreshTokenExpiredIn: process.env.AUTH_REFRESH_TOKEN_EXPIRE_MIN,
  httpLogEnabled: process.env.HTTP_LOG_ENABLED,
  exceptionLogEnabled: process.env.EXCEPTION_LOG_ENABLED,
  hashKey: process.env.HASH_KEY,
  appBackendUrl: process.env.APP_BACKEND_URL,
  appFrontendUrl: process.env.APP_FRONTEND_URL,
  passwordResetTokenExpiredMinute:
    process.env.PASSWORD_RESET_TOKEN_EXPIRED_MINUTES,
}));
