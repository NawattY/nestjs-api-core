import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => ({
  url: process.env.AWS_S3_URL,
  accessKey: process.env.AWS_S3_ACCESS_KEY_ID,
  secretKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
  bucket: process.env.AWS_S3_BUCKET,
  acl:
    process.env.AWS_S3_ACL && process.env.AWS_S3_ACL.length
      ? process.env.AWS_S3_ACL
      : 'public-read',
}));
