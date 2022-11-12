import { S3ModuleUploadedFile } from '@appotter/nestjs-s3';
import isEmpty from 'lodash/isEmpty';
import { MemoryStoredFile } from 'nestjs-form-data';

export function s3CustomFile(file: MemoryStoredFile) {
  if (!isEmpty(file)) {
    return {
      originalname: file.originalName,
      encoding: file?.encoding,
      mimetype: file.mimetype,
      buffer: file.buffer,
      size: file.size,
      filename: file.originalName,
    } as S3ModuleUploadedFile;
  }

  return null;
}
