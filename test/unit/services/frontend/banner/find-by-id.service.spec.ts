import { MerchantConnectionEntity } from '@entities/default/merchant-connections.entity';
import { BranchEntity } from '@entities/tenant/branch.entity';
import { BannerEntity } from '@entities/tenant/banner.entity';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BannerService } from '@services/frontend/banner.service';
import { plainToInstance } from 'class-transformer';
import { TenantsService } from 'src/app/tenancy/tenancy.service';
import { Connection, Repository } from 'typeorm';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { get } from 'lodash';

describe('Banner get connection', () => {
  let fakeMerchantConnection: Partial<Connection>;
  let service: BannerService;

  beforeEach(async () => {
    fakeMerchantConnection = {
      getRepository: jest.fn(),
    };
  });

  it('should ok return banner', async () => {
    const bannerEntity = plainToInstance(BannerEntity, {
      id: 1,
    });
    const branchEntity = plainToInstance(BranchEntity, {
      id: 1,
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
            getRawOne: jest.fn().mockReturnThis(),
          })),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        BannerService,
        TenantsService,
        ConfigService,
        {
          provide: getRepositoryToken(BranchEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MerchantConnectionEntity),
          useClass: Repository,
        },
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
      ],
    }).compile();

    service = await module.resolve<BannerService>(BannerService);

    await service.findById(bannerEntity.id, branchEntity.id);
  });

  it('should throw exception if banner not found', async () => {
    const bannerEntity = plainToInstance(BannerEntity, {
      id: 1,
    });
    const branchEntity = plainToInstance(BranchEntity, {
      id: 1,
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
            getRawOne: jest.fn().mockReturnValue(null),
          })),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        BannerService,
        TenantsService,
        ConfigService,
        {
          provide: getRepositoryToken(BranchEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MerchantConnectionEntity),
          useClass: Repository,
        },
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
      ],
    }).compile();

    service = await module.resolve<BannerService>(BannerService);

    try {
      await service.findById(bannerEntity.id, branchEntity.id);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(501002);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BANNER_NOT_FOUND',
      );
    }
  });
});
