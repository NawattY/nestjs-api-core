import { ConfigService } from '@nestjs/config';

export function getThumbnail(file: string) {
  if (!file) {
    return null;
  }

  const filename = file.split('/').pop();

  return `${file.replace(filename, '')}thumbnail-${filename}`;
}

export function getUrlImage(file: string) {
  if (!file) {
    return null;
  }

  const config = new ConfigService();
  const awsUrl = config.get('AWS_S3_URL').replace(/\/$/, '');

  const original = `${awsUrl}/${file}`;
  const filename = file.split('/').pop();
  const thumbnail = `${awsUrl}/${file.replace(
    filename,
    '',
  )}thumbnail-${filename}`;

  return {
    original: original,
    thumbnail: thumbnail,
  };
}
