import { Injectable } from '@nestjs/common';
import { statSync } from 'fs';
import { lookup } from 'mime-types';
import { MemoryStoredFile } from 'nestjs-form-data';
import { s3CustomFile } from '@helpers/s3-custom-file.helper';
import { S3Service } from '@appotter/nestjs-s3';
import { CreateThumbnailProvider } from '@providers/filesystems/s3/create-thumbnail.provider';
import { get } from 'lodash';
import { default as sharp } from 'sharp';

@Injectable()
export class UploadFile {
  constructor(
    private s3Service: S3Service,
    private createThumbnailProvider: CreateThumbnailProvider,
  ) {}

  async uploadImage(
    filePath?: string,
    folderPath?: string,
    params?: any,
  ): Promise<string> {
    let localeFile = {};

    if (filePath) {
      const buffer = await sharp(filePath).withMetadata().toBuffer();

      localeFile = {
        originalName: filePath.split('/').pop(),
        mimetype: lookup(filePath),
        buffer: buffer,
        size: statSync(filePath).size,
      } as MemoryStoredFile;
    }

    const image = get(params, 'image') || localeFile;

    const s3customFile = s3CustomFile(image);
    let locationImage = '';

    if (s3customFile) {
      const { origin } = await this.s3Service.putAsUniqueName(
        s3customFile,
        folderPath,
      );

      locationImage = origin.Key;

      await this.createThumbnailProvider.create(
        image,
        locationImage.replace(folderPath, ''),
        params?.weight || 500,
        params?.height || 500,
        folderPath,
      );
    }

    return locationImage;
  }
}
