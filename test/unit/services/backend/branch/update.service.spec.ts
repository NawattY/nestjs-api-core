import { Test } from '@nestjs/testing';
import { Connection, UpdateResult } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { AppConfigService } from 'src/config/app/config.service';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { get } from 'lodash';
import { BranchUpdateDto } from '@dtos/v1/backend/branch/branch-update.dto';
import { BranchEntity } from '@entities/tenant/branch.entity';
import { BranchService } from '@services/backend/branch.service';

describe('BranchServiceUpdate', () => {
  let service: BranchService;
  let fakeMerchantConnection: Partial<Connection>;

  beforeEach(async () => {
    fakeMerchantConnection = {
      getRepository: jest.fn(),
    };
  });

  it('should be ok', async () => {
    const parameters = {
      title: '{"th":"เทส","en":"Test 1"}',
      phone: '0891111111',
      isActive: 1,
    };

    const branch: BranchEntity = plainToInstance(BranchEntity, {
      id: 1,
      title: '{"th":"เทส","en":"Test 1"}',
      phone: '0891111111',
      isActive: 1,
    });

    const updateResult = plainToInstance(UpdateResult, {
      generatedMaps: [],
      raw: [
        {
          id: 1,
          title: '{"th":"เทส","en":"Test 1"}',

          phone: '0891111111',
          isActive: 1,
        },
      ],
      affected: 1,
    });

    // mock getRepository(BranchEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(branch),
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValue(updateResult),
          })),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        BranchService,
        {
          provide: AppConfigService,
          useValue: {},
        },
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
      ],
    }).compile();

    service = module.get<BranchService>(BranchService);

    const result = await service.update(1, parameters);

    expect(result).toEqual({ ...branch, ...parameters });
  });

  it('should throw exception if branch update error', async () => {
    const parameters = {
      title: '{"th":"เทส","en":"Test 1"}',
      phone: '0891111111',
      isActive: 1,
    } as BranchUpdateDto;

    const branch: BranchEntity = plainToInstance(BranchEntity, {
      id: 1,
      title: '{"th":"เทส","en":"Test 1"}',
      phone: '0891111111',
      isActive: 1,
    });

    const updateResult = plainToInstance(UpdateResult, {
      generatedMaps: [],
      raw: [
        {
          id: 1,
          title: branch.title,
          isActive: 1,
          createdAt: branch.createdAt,
          updatedAt: branch.updatedAt,
          deletedAt: null,
        },
      ],
      affected: 1,
    });

    // mock getRepository(BranchEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(branch),
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
          findOne: jest.fn().mockResolvedValue(branch),
          update: jest.fn().mockResolvedValue(updateResult),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        BranchService,
        {
          provide: AppConfigService,
          useValue: {},
        },
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
      ],
    }).compile();

    service = module.get<BranchService>(BranchService);

    try {
      await service.update(branch.id, parameters);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(500003);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BRANCH_UPDATE_ERROR',
      );
    }
  });

  it('should throw exception if not affected error', async () => {
    const parameters = {
      title: '{"th":"เทส","en":"Test 1"}',
      phone: '0891111111',
      isActive: 1,
    } as BranchUpdateDto;

    const branch: BranchEntity = plainToInstance(BranchEntity, {
      id: 1,
      title: '{"th":"เทส","en":"Test 1"}',
      phone: '0891111111',
      isActive: 1,
    });

    const updateResult = plainToInstance(UpdateResult, {
      generatedMaps: [],
      raw: [
        {
          id: 1,
          title: branch.title,
          isActive: 1,
          createdAt: branch.createdAt,
          updatedAt: branch.updatedAt,
          deletedAt: null,
        },
      ],
      affected: 0,
    });

    // mock getRepository(BranchEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(branch),
          update: jest.fn().mockResolvedValue(updateResult),
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            execute: jest.fn().mockReturnValue(updateResult),
          })),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        BranchService,
        {
          provide: AppConfigService,
          useValue: {},
        },
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
      ],
    }).compile();

    service = module.get<BranchService>(BranchService);

    try {
      await service.update(branch.id, parameters);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(500002);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BRANCH_NOT_FOUND',
      );
    }
  });
});
