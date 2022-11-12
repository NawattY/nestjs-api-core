import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  mail: {
    mailer: process.env.MAIL_MAILER,
    form: process.env.MAIL_FROM,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
  },
}));
