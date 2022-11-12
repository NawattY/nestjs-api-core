import { Test } from '@nestjs/testing';
import { Connection, UpdateResult } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BannerEntity } from '@entities/tenant/banner.entity';
import { BannerService } from '@services/backend/merchant/banner.service';
import { AppConfigService } from 'src/config/app/config.service';
import { S3Service } from '@appotter/nestjs-s3';
import { UploadFile } from '@helpers/upload-file.helper';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { get } from 'lodash';

describe('BannerService -> destroy', () => {
  const sharedTestProviders = [
    BannerService,
    {
      provide: AppConfigService,
      useValue: {},
    },
    {
      provide: UploadFile,
      useValue: {},
    },
    {
      provide: S3Service,
      useValue: {},
    },
  ];

  let service: BannerService;
  let fakeMerchantConnection: Partial<Connection>;

  beforeEach(async () => {
    fakeMerchantConnection = {
      getRepository: jest.fn(),
    };
  });

  it('should be ok', async () => {
    const banner: BannerEntity = plainToInstance(BannerEntity, {
      id: 10,
      title: 'banner title',
    });

    const deleteResult = plainToInstance(UpdateResult, {
      generatedMaps: [],
      raw: [],
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
          softDelete: jest.fn().mockResolvedValue(deleteResult),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        ...sharedTestProviders,
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
      ],
    }).compile();

    service = module.get<BannerService>(BannerService);

    const result = await service.destroy(banner.id);

    expect(result).toBeUndefined();
  });

  it('should throw exception if banner not found', async () => {
    // mock getRepository(BannerEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(null),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        ...sharedTestProviders,
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
      ],
    }).compile();

    service = module.get<BannerService>(BannerService);

    try {
      await service.destroy(1);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(501002);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BANNER_NOT_FOUND',
      );
    }
  });

  it('should throw exception if banner delete error', async () => {
    const banner: BannerEntity = plainToInstance(BannerEntity, {
      id: 10,
      title: 'banner title',
    });

    // mock getRepository(BannerEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(banner),
          softDelete: jest.fn().mockRejectedValue(new Error('error')),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        ...sharedTestProviders,
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
      ],
    }).compile();

    service = module.get<BannerService>(BannerService);

    try {
      await service.destroy(1);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(501005);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BANNER_DELETE_ERROR',
      );
    }
  });
});
