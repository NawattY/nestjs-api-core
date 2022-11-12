import { registerAs } from '@nestjs/config';

export default registerAs('graylog', () => ({
  host: process.env.GRAYLOG_HOST,
  port: process.env.GRAYLOG_PORT,
  facility: process.env.GRAYLOG_FACILITY,
}));
