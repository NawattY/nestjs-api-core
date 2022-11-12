import { MemoryStoredFile } from 'nestjs-form-data';
import { s3CustomFile } from '@helpers/s3-custom-file.helper';
import { S3Service } from '@appotter/nestjs-s3';
import { Injectable } from '@nestjs/common';
import { S3Exception } from '@exceptions/app/s3.exception';
import { default as sharp } from 'sharp';

@Injectable()
export class CreateThumbnailProvider {
  constructor(private s3Service: S3Service) {}

  async create(
    file: MemoryStoredFile,
    fileName: string,
    width: number,
    hight: number,
    path: string,
  ) {
    if (!file) {
      return null;
    }

    try {
      const fileBuffer = await sharp(file.buffer)
        .resize(width, hight, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toBuffer();

      file.originalName = fileName;
      file.buffer = fileBuffer;

      const thumbnail = s3CustomFile(file);
      const { origin } = await this.s3Service.put(
        thumbnail,
        `${path}thumbnail-${fileName}`,
      );

      return origin;
    } catch (e) {
      throw S3Exception.uploadImageError(e);
    }
  }
}
