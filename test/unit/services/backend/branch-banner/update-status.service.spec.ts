import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { AppConfigService } from 'src/config/app/config.service';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { get } from 'lodash';
import { BranchBannerService } from '@services/backend/branch-banner.service';
import { BannerEntity } from '@entities/tenant/banner.entity';

describe('BranchBannerService -> updateStatus', () => {
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

  it('should be ok if active branch banner', async () => {
    const fakeBranchInactiveBanner = {
      id: 1,
      title: 'banner title',
      is_active: 1,
      inactive_id: 1,
      inactive_banner_id: 1,
      inactive_branch_id: 10,
    };

    const params = {
      isActive: 1,
      branchId: fakeBranchInactiveBanner.inactive_branch_id,
    };

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
            getRawOne: jest.fn().mockResolvedValue(fakeBranchInactiveBanner),
          })),
        };
      });

    // mock getRepository(BranchInactiveBannerEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          delete: jest.fn().mockResolvedValue({ raw: 1 }),
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

    const result = await service.updateStatus(
      fakeBranchInactiveBanner.id,
      params,
    );

    expect(result).toBeUndefined();
  });

  it('should be ok if inactive branch banner', async () => {
    const params = {
      isActive: 0,
    };
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

    // mock getRepository(BranchInactiveBannerEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          save: jest.fn(),
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

    const result = await service.updateStatus(banner.id, params);

    expect(result).toBeUndefined();
  });

  it('should throw exception if delete error', async () => {
    const fakeBranchInactiveBanner = {
      id: 1,
      title: 'banner title',
      is_active: 1,
      inactive_id: 1,
      inactive_banner_id: 1,
      inactive_branch_id: 10,
    };

    const params = {
      isActive: 1,
      branchId: fakeBranchInactiveBanner.inactive_branch_id,
    };

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
            getRawOne: jest.fn().mockResolvedValue(fakeBranchInactiveBanner),
          })),
        };
      });

    // mock getRepository(BranchInactiveBannerEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          delete: jest.fn().mockRejectedValue(new Error('error')),
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
      await service.updateStatus(fakeBranchInactiveBanner.id, params);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(502001);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BRANCH_INACTIVE_BANNER_DELETE_ERROR',
      );
    }
  });

  it('should throw exception if create error', async () => {
    const params = {
      isActive: 0,
    };
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

    // mock getRepository(BranchInactiveBannerEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          create: jest.fn().mockRejectedValue(new Error('error')),
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
      await service.updateStatus(banner.id, params);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(502002);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BRANCH_INACTIVE_BANNER_CREATE_ERROR',
      );
    }
  });
});
