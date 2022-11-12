import { CACHE_MANAGER, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantEntity } from 'src/app/entities/default/merchant.entity';
import { Repository } from 'typeorm';
import { MerchantException } from '@exceptions/app/merchant.exception';
import { get, isEmpty } from 'lodash';
import { UpdateLocaleDto } from '@dtos/v1/backend/merchant/update-locale.dto';
import { FRONTEND_LOCALE } from '@constants/frontend-locale';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { UpdateTemplateDto } from '@dtos/v1/backend/merchant/update-template.dto';
import { s3CustomFile } from '@helpers/s3-custom-file.helper';
import { S3Exception } from '@exceptions/app/s3.exception';
import { S3Service } from '@appotter/nestjs-s3';
import { PATH_MERCHANT_IMAGE } from '@constants/path-upload';
import { getThumbnail } from '@helpers/thumbnail.helper';
import { UploadFile } from '@helpers/upload-file.helper';

@Injectable({ scope: Scope.REQUEST })
export class MerchantService {
  constructor(
    @InjectRepository(MerchantEntity)
    private merchantRepository: Repository<MerchantEntity>,
    @Inject(REQUEST) private request: Request,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private s3Service: S3Service,
    private uploadFile: UploadFile,
  ) {}

  async findById(id: number): Promise<MerchantEntity> {
    const merchant = await this.merchantRepository.findOne({
      where: {
        id,
      },
    });

    if (!merchant) {
      throw MerchantException.notFound();
    }

    return merchant;
  }

  async updateLocale(dto: UpdateLocaleDto): Promise<void> {
    const filterLocale = dto.supportLocales.filter(
      (locale) => !isEmpty(locale) && FRONTEND_LOCALE.indexOf(locale) === -1,
    );

    if (filterLocale.length > 0) {
      throw MerchantException.supportLocaleMismatch();
    }

    if (!dto.supportLocales.includes(dto.locale)) {
      throw MerchantException.missingLocale();
    }

    const merchantId = this.request.merchantId;
    const merchant = await this.findById(merchantId);
    const settings = get(merchant, 'settings', {});

    settings['supportLocales'] = dto.supportLocales;
    settings['locale'] = dto.locale;

    try {
      await this.merchantRepository.update(merchantId, {
        settings: JSON.parse(JSON.stringify(settings)),
      });

      await this.cacheManager.set(`default-locale-${merchantId}`, dto.locale, {
        ttl: 86400,
      });
    } catch (error) {
      throw MerchantException.updateLocaleError(error);
    }
  }

  /**
   *
   * @param params
   */
  async updateTemplate(params: UpdateTemplateDto): Promise<MerchantEntity> {
    const merchantId = this.request.merchantId;
    const merchant = await this.findById(merchantId);
    const getLogoImage = get(merchant.settings, 'logoImage', null);
    let locationLogoImage = get(merchant.settings, 'logoImage', null);
    const thumbnail = getLogoImage ? getThumbnail(getLogoImage) : null;
    try {
      if (params.logoImage) {
        const fileLogoImage = s3CustomFile(params.logoImage);

        if (fileLogoImage) {
          if (getLogoImage) {
            await this.s3Service.delete(getLogoImage);
            await this.s3Service.delete(thumbnail);
          }

          locationLogoImage = await this.uploadFile.uploadImage(
            null,
            PATH_MERCHANT_IMAGE,
            {
              image: params.logoImage,
              weight: 140,
              height: 140,
            },
          );
        }
      } else {
        if (typeof params.logoImage !== 'undefined' && getLogoImage) {
          await this.s3Service.delete(getLogoImage);
          await this.s3Service.delete(thumbnail);
          const path = 'storage/logo_default.png';
          locationLogoImage = await this.uploadFile.uploadImage(
            path,
            PATH_MERCHANT_IMAGE,
            { weight: 140, height: 140 },
          );
        }
      }
    } catch (e) {
      throw S3Exception.uploadImageError(e);
    }

    const settings = get(merchant, 'settings', {});
    let secondaryColor = '';

    if (params?.secondaryColor) {
      secondaryColor = params.secondaryColor;
    }

    settings['logoImage'] = locationLogoImage;
    settings['primaryColor'] = params.primaryColor;
    settings['secondaryColor'] = secondaryColor;
    settings['textOnPrimaryColor'] = params.textOnPrimaryColor;
    settings['backgroundColor'] = params.backgroundColor;

    try {
      await this.merchantRepository.update(merchantId, {
        settings: JSON.parse(JSON.stringify(settings)),
      });
    } catch (error) {
      throw MerchantException.updateTemplateError(error);
    }

    return await this.findById(merchantId);
  }
}
