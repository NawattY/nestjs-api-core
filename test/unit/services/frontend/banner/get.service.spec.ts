import { MerchantConnectionEntity } from '@entities/default/merchant-connections.entity';
import { BranchEntity } from '@entities/tenant/branch.entity';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BannerService } from '@services/frontend/banner.service';
import { plainToInstance } from 'class-transformer';
import { TenantsService } from 'src/app/tenancy/tenancy.service';
import { Connection, Repository } from 'typeorm';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';

describe('Banner get', () => {
  let fakeMerchantConnection: Partial<Connection>;
  let service: BannerService;

  beforeEach(async () => {
    fakeMerchantConnection = {
      getRepository: jest.fn(),
    };
  });

  it('should ok return banner', async () => {
    const branchEntity = plainToInstance(BranchEntity, {
      id: 1,
      title: 'test',
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
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            addGroupBy: jest.fn().mockReturnThis(),
            getRawMany: jest.fn().mockReturnThis(),
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

    await service.get(branchEntity.id);
  });
});
