/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BannerEntity } from '@entities/tenant/banner.entity';
import { BannerService } from '@services/backend/merchant/banner.service';
import { AppConfigService } from 'src/config/app/config.service';
import { S3Service } from '@appotter/nestjs-s3';
import { UploadFile } from '@helpers/upload-file.helper';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { get } from 'lodash';
import { BannerUpdateDto } from '@dtos/v1/backend/merchant/banner/banner-update.dto';
import { BannerLinkEnum } from '@enums/banner-link';
import { MemoryStoredFile } from 'nestjs-form-data';
import { PATH_BANNER_IMAGE } from '@constants/path-upload';

describe('BannerServiceStore', () => {
  let service: BannerService;
  let fakeMerchantConnection: Partial<Connection>;
  let fakeS3Service: Partial<S3Service>;
  let uploadFile: Partial<UploadFile>;

  beforeEach(async () => {
    fakeMerchantConnection = {
      getRepository: jest.fn(),
    };
    fakeS3Service = {
      putAsUniqueName: jest.fn(),
      delete: jest.fn(),
    };
    uploadFile = {
      uploadImage: jest.fn(),
    };
  });

  it('should be ok', async () => {
    const parameters = {
      title: 'test',
      startDate: '2022-09-27 17:19:00',
      endDate: '2022-09-27 17:19:00',
      linkType: BannerLinkEnum.EXTERNAL,
      linkTo: 'http://example.com',
      target: '_blank',
      isActive: 1,
      image: plainToInstance(MemoryStoredFile, {
        originalName: 'name.jpeg',
        mimetype: 'image/jpeg',
        size: 10000,
        buffer: Buffer.alloc(10000),
      }),
    } as BannerUpdateDto;

    const banner: BannerEntity = plainToInstance(BannerEntity, {
      id: 1,
      title: 'banner title',
      startDate: '2022-09-27 17:19:00',
      endDate: '2022-09-27 17:19:00',
      linkType: BannerLinkEnum.EXTERNAL,
      linkTo: 'http://example.com',
      target: '_blank',
      image: 'banner/images/19f10171-895b-4558-afef-6fd7f001b3e9.png',
      isActive: 1,
    });

    // mock getRepository(BannerEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(banner),
          save: jest.fn().mockResolvedValue(banner),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        BannerService,
        {
          provide: AppConfigService,
          useValue: {},
        },
        {
          provide: UploadFile,
          useValue: { uploadImage: jest.fn() },
        },
        {
          provide: S3Service,
          useValue: fakeS3Service,
        },
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
      ],
    }).compile();

    service = module.get<BannerService>(BannerService);
    fakeS3Service = module.get<S3Service>(S3Service);
    uploadFile = module.get<UploadFile>(UploadFile);

    jest
      .spyOn(uploadFile, 'uploadImage')
      .mockResolvedValue(`${PATH_BANNER_IMAGE}image.jpg`);

    const result = await service.store(parameters);
    expect(result).toEqual(banner);
  });

  it('should throw exception if banner create error', async () => {
    const parameters = {
      title: 'test',
      startDate: '2022-09-27 17:19:00',
      endDate: '2022-09-27 17:19:00',
      linkType: BannerLinkEnum.PRODUCT,
      linkTo: '1',
      isActive: 1,
      target: '_blank',
      image: plainToInstance(MemoryStoredFile, {
        originalName: 'name.jpeg',
        mimetype: 'image/jpeg',
        size: 10000,
        buffer: Buffer.alloc(10000),
      }),
    } as BannerUpdateDto;

    // mock getRepository(BannerEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          save: jest.fn().mockRejectedValue(new Error('error')),
        };
      });

    // mock getRepository(BannerEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          findOne: jest.fn().mockReturnThis(),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        BannerService,
        {
          provide: AppConfigService,
          useValue: {},
        },
        {
          provide: UploadFile,
          useValue: {
            uploadImage: jest.fn(),
          },
        },
        {
          provide: S3Service,
          useValue: fakeS3Service,
        },
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
      ],
    }).compile();

    service = module.get<BannerService>(BannerService);

    try {
      await service.store(parameters);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(501001);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BANNER_CREATE_ERROR',
      );
    }
  });
});
