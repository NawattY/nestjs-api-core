import { registerAs } from '@nestjs/config';

export default registerAs('graylog', () => ({
  accessKeyId: process.env.AWS_CLOUDWATCH_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_CLOUDWATCH_SECRET_ACCESS_KEY,
  region: process.env.AWS_CLOUDWATCH_REGION,
  logGroupName: process.env.AWS_CLOUDWATCH_LOG_GROUP_NAME,
  logStreamName: process.env.AWS_CLOUDWATCH_LOG_STREAM_NAME,
}));
