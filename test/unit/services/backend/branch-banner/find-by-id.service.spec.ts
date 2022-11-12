import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { AppConfigService } from 'src/config/app/config.service';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { get } from 'lodash';
import { BranchBannerService } from '@services/backend/branch-banner.service';
import { BannerEntity } from '@entities/tenant/banner.entity';

describe('BranchBannerService -> findById', () => {
  const sharedTestProviders = [
    BranchBannerService,
    {
      provide: AppConfigService,
      useValue: {},
    },
  ];

  let service: BranchBannerService;
  let fakeMerchantConnection: Partial<Connection>;

  beforeEach(async () => {
    fakeMerchantConnection = {
      getRepository: jest.fn(),
    };
  });

  it('should be ok', async () => {
    const banner: BannerEntity = plainToInstance(BannerEntity, {
      id: 1,
      title: 'banner title',
      isActive: 1,
    });

    // mock getRepository(BannerEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue(banner),
          })),
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

    service = module.get<BranchBannerService>(BranchBannerService);

    const result = await service.findById(banner.id, 1);

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
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue(null),
          })),
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

    service = module.get<BranchBannerService>(BranchBannerService);

    try {
      await service.findById(1, 1);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(501002);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BANNER_NOT_FOUND',
      );
    }
  });
});
