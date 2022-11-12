import { S3Service } from '@appotter/nestjs-s3';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { BannerEntity } from '@entities/tenant/banner.entity';
import { UploadFile } from '@helpers/upload-file.helper';
import { Test } from '@nestjs/testing';
import { BannerService } from '@services/backend/merchant/banner.service';
import { get } from 'lodash';
import { AppConfigService } from 'src/config/app/config.service';
import { Connection } from 'typeorm';
import { plainToInstance } from 'class-transformer';

describe('Backend -> BannerService -> findById', () => {
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

    // mock getRepository(BannerEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(banner),
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

    const result = await service.findById(banner.id);

    expect(result.id).toEqual(banner.id);
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
      await service.findById(1);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(501002);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BANNER_NOT_FOUND',
      );
    }
  });
});
