import { randomUUID } from 'crypto';
import { MerchantEntity } from '@entities/default/merchant.entity';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import QRCode from 'qrcode';
import { default as sharp } from 'sharp';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { get } from 'lodash';
import { getUrlImage } from '@helpers/thumbnail.helper';
import fetch from 'node-fetch';
import { I18nService } from 'nestjs-i18n';
import { AppConfigService } from 'src/config/app/config.service';
import { readFileSync, unlinkSync } from 'fs';
import { UploadFile } from '@helpers/upload-file.helper';
import { encodeId } from '@helpers/hash-id.helper';
import { QrCodeException } from '@exceptions/app/qr-code.exception';
import sizeOf from 'image-size';

@Injectable({ scope: Scope.REQUEST })
export class QrCodeService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(MerchantEntity)
    private merchantRepository: Repository<MerchantEntity>,
    private readonly i18n: I18nService,
    private appConfig: AppConfigService,
    private uploadFile: UploadFile,
  ) {}

  async getQrCode() {
    try {
      const { settings, domain } = await this.merchantRepository.findOne(
        {
          id: this.request.merchantId,
        },
        { select: ['settings', 'domain'] },
      );

      const hashId = encodeId(this.request.branchId);
      const frontendUrl = `https://${domain}/menu-${hashId}`;

      let qrCode = await QRCode.toBuffer(frontendUrl, {
        width: 920,
        margin: 1,
      });
      qrCode = await sharp('src/public/images/white-bg-qr-code.png')
        .composite([{ input: qrCode }])
        .toBuffer();

      const primaryColor = get(settings, 'primaryColor');
      const secondaryColor = get(settings, 'secondaryColor');
      const textOnPrimaryColor = get(settings, 'textOnPrimaryColor');

      let background = Buffer.from(
        `<svg width="1120" height="1500" xmlns="http://www.w3.org/2000/svg">
          <rect width="1120" height="1500" style="fill:${primaryColor}" />
        </svg>`,
      );

      if (secondaryColor) {
        background = Buffer.from(
          `<svg width="1120" height="1500" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="1120" height="1500" fill="url(#grad1)" />
          </svg>`,
        );
      }

      const svgFile = readFileSync(
        `src/public/images/scan_view_menu_${this.request.locale}.svg`,
        'utf8',
      );
      const replaceText = svgFile.replace('replace_color', textOnPrimaryColor);

      const svgText = Buffer.from(replaceText);

      const image = getUrlImage(get(settings, 'logoImage'));
      const imageUrl = await fetch(image.original);
      const imageBuffer = await imageUrl.buffer();

      const logo = await sharp(imageBuffer)
        .resize(350, 150, {
          fit: 'inside',
        })
        .toBuffer();

      const text = await sharp(svgText)
        .resize(800, 150, {
          fit: 'inside',
        })
        .toBuffer();

      const uuid = randomUUID();
      const pathWithBackground = `src/public/images/with-background-${uuid}.png`;
      const pathWithOutBackground = `src/public/images/without-background-${uuid}.png`;

      const dimensions = sizeOf(logo);

      let width = dimensions.width;
      if (dimensions.width > 350) {
        width = 350;
      }

      let height = 80;
      if (dimensions.height < 150) {
        height = 150 - dimensions.height + 80;
      }

      await sharp(background)
        .resize(1125, 1500)
        .composite([
          {
            input: logo,
            top: height,
            left: Math.trunc((1125 - width) / 2),
          },
          { input: qrCode },
          { input: text, top: 1250, left: Math.trunc((1125 - 800) / 2) },
        ])
        .toFile(pathWithBackground);

      const qrWithBackground = await this.uploadFile.uploadImage(
        pathWithBackground,
        'qr-code/images/',
      );

      await sharp(qrCode).toFile(pathWithOutBackground);

      const qrWithOutBackGround = await this.uploadFile.uploadImage(
        pathWithOutBackground,
        'qr-code/images/',
      );

      unlinkSync(pathWithBackground);
      unlinkSync(pathWithOutBackground);

      return {
        qrCode: getUrlImage(qrWithOutBackGround).original,
        qrCodeWithBackground: getUrlImage(qrWithBackground).original,
      };
    } catch (error) {
      throw QrCodeException.CreateQrCodeError();
    }
  }
}
