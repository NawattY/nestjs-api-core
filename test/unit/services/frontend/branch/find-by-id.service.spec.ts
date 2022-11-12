import { MerchantConnectionEntity } from '@entities/default/merchant-connections.entity';
import { BranchEntity } from '@entities/tenant/branch.entity';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BranchService } from '@services/frontend/branch.service';
import { plainToInstance } from 'class-transformer';
import { TenantsService } from 'src/app/tenancy/tenancy.service';
import { Connection, Repository } from 'typeorm';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { get } from 'lodash';

describe('Branch get connection', () => {
  let fakeMerchantConnection: Partial<Connection>;
  let service: BranchService;

  beforeEach(async () => {
    fakeMerchantConnection = {
      getRepository: jest.fn(),
    };
  });

  it('should ok return branch', async () => {
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
          findOne: jest.fn().mockReturnThis(),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        BranchService,
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

    service = await module.resolve<BranchService>(BranchService);

    await service.findById(branchEntity.id);
  });

  it('should throw exception if branch not found', async () => {
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
          findOne: jest.fn().mockReturnValue(null),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        BranchService,
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

    service = await module.resolve<BranchService>(BranchService);

    try {
      await service.findById(branchEntity.id);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(500002);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BRANCH_NOT_FOUND',
      );
    }
  });
});
