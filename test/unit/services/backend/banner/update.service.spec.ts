import { Test } from '@nestjs/testing';
import { Connection, UpdateResult } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ProductEntity } from '@entities/tenant/products.entity';
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

describe('BannerServiceUpdate', () => {
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
      type: BannerLinkEnum.EXTERNAL,
      startDate: new Date(),
      endDate: new Date(),
      linkType: BannerLinkEnum.EXTERNAL,
      linkTo: 'http://example.com',
      target: '_blank',
      isActive: 1,
      image: 'http://example.com',
    };

    const banner: BannerEntity = plainToInstance(BannerEntity, {
      id: 1,
      title: 'test',
      startDate: new Date(),
      endDate: new Date(),
      linkType: BannerLinkEnum.EXTERNAL,
      linkTo: 'http://example.com',
      target: '_blank',
      isActive: 1,
    });

    const product: ProductEntity = plainToInstance(ProductEntity, {
      id: 1,
      title: '{"th":"ใบไม้ขึ้นหัวแล้วนะ","en":"Test 1"}',
      detail: '{"th":"สีเขียวสดใส หมาน่ารักมาก","en":"Color green"}',
      categoryId: 4,
      image: 'product/images/19f10171-895b-4558-afef-6fd7f001b3e9.png',
      isActive: 1,
      ordinal: 2,
      specialPrice: 0,
      normalPrice: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const updateResult = plainToInstance(UpdateResult, {
      generatedMaps: [],
      raw: [
        {
          id: 1,
          title: 'test',
          startDate: new Date(),
          endDate: new Date(),
          type: BannerLinkEnum.EXTERNAL,
          linkType: BannerLinkEnum.EXTERNAL,
          linkTo: 'http://example.com',
          target: '_blank',
          isActive: 1,
        },
      ],
      affected: 1,
    });

    // mock getRepository(BannerEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(banner),
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValue(updateResult),
          })),
        };
      });

    // mock getRepository(ProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(product),
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

    const mockS3DeleteResponse = {
      status: true,
      origin: {},
    };

    jest
      .spyOn(uploadFile, 'uploadImage')
      .mockResolvedValue(`${PATH_BANNER_IMAGE}image.jpg`);
    jest
      .spyOn(fakeS3Service, 'delete')
      .mockResolvedValueOnce(mockS3DeleteResponse);

    const result = await service.update(1, parameters);

    expect(result).toEqual({ ...banner, ...parameters });
  });

  it('should throw exception if banner update error', async () => {
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

    const banner: BannerEntity = plainToInstance(BannerEntity, {
      id: 1,
      title: 'banner title',
      startDate: '2022-09-27 17:19:00',
      endDate: '2022-09-27 17:19:00',
      linkType: BannerLinkEnum.PRODUCT,
      linkTo: '1',
      image: 'http://image.jpg',
      isActive: 1,
    });

    const updateResult = plainToInstance(UpdateResult, {
      generatedMaps: [],
      raw: [
        {
          id: 1,
          title: banner.title,
          startDate: banner.startDate,
          endDate: banner.endDate,
          linkType: BannerLinkEnum.PRODUCT,
          linkTo: 1,
          isActive: 1,
          createdAt: banner.createdAt,
          updatedAt: banner.updatedAt,
          deletedAt: null,
        },
      ],
      affected: 1,
    });

    // mock getRepository(BannerEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(banner),
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            execute: jest.fn().mockRejectedValue(new Error('error')),
          })),
        };
      });

    // mock getRepository(ProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(banner),
          update: jest.fn().mockResolvedValue(updateResult),
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
      await service.update(banner.id, parameters);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(501003);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BANNER_UPDATE_ERROR',
      );
    }
  });

  it('should throw exception if not affected error', async () => {
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
      linkType: BannerLinkEnum.PRODUCT,
      linkTo: 'https://google.co.th',
      image: 'banner/images/19f10171-895b-4558-afef-6fd7f001b3e9.png',
      isActive: 1,
    });

    const product: ProductEntity = plainToInstance(ProductEntity, {
      id: 1,
      title: '{"th":"ใบไม้ขึ้นหัวแล้วนะ","en":"Test 1"}',
      detail: '{"th":"สีเขียวสดใส หมาน่ารักมาก","en":"Color green"}',
      categoryId: 4,
      image: 'product/images/19f10171-895b-4558-afef-6fd7f001b3e9.png',
      isActive: 1,
      ordinal: 2,
      specialPrice: 0,
      normalPrice: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const updateResult = plainToInstance(UpdateResult, {
      generatedMaps: [],
      raw: [
        {
          id: 1,
          title: banner.title,
          startDate: banner.startDate,
          endDate: banner.endDate,
          linkType: BannerLinkEnum.PRODUCT,
          linkTo: 1,
          isActive: 1,
          createdAt: banner.createdAt,
          updatedAt: banner.updatedAt,
          deletedAt: null,
        },
      ],
      affected: 0,
    });

    // mock getRepository(BannerEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(banner),
          update: jest.fn().mockResolvedValue(updateResult),
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            execute: jest.fn().mockReturnValue(updateResult),
          })),
        };
      });

    // mock getRepository(ProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(product),
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

    const mockS3DeleteResponse = {
      status: true,
      origin: {},
    };

    jest
      .spyOn(uploadFile, 'uploadImage')
      .mockResolvedValue(`${PATH_BANNER_IMAGE}image.jpg`);
    jest
      .spyOn(fakeS3Service, 'delete')
      .mockResolvedValueOnce(mockS3DeleteResponse);

    try {
      await service.update(banner.id, parameters);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(501004);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BANNER_UPDATE_ERROR_NOT_AFFECTED',
      );
    }
  });
});
