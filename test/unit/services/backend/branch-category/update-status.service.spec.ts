import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { AppConfigService } from 'src/config/app/config.service';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { get } from 'lodash';
import { BranchCategoryService } from '@services/backend/branch-category.service';
import { CategoryEntity } from '@entities/tenant/categories.entity';

describe('BranchCategoryService -> updateStatus', () => {
  const sharedTestProviders = [
    BranchCategoryService,
    {
      provide: AppConfigService,
      useValue: {},
    },
  ];

  let service: BranchCategoryService;
  let fakeMerchantConnection: Partial<Connection>;

  beforeEach(async () => {
    fakeMerchantConnection = {
      getRepository: jest.fn(),
    };
  });

  it('should be ok if active branch category', async () => {
    const fakeBranchInactiveCategory = {
      id: 1,
      title: '{"en":"category title"}',
      is_active: 1,
      inactive_id: 1,
      inactive_category_id: 1,
      inactive_branch_id: 10,
    };

    const params = {
      isActive: 1,
      branchId: fakeBranchInactiveCategory.inactive_branch_id,
    };

    // mock getRepository(CategoryEntity)
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
            getRawOne: jest.fn().mockResolvedValue(fakeBranchInactiveCategory),
          })),
        };
      });

    // mock getRepository(BranchInactiveCategoryEntity)
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

    service = module.get<BranchCategoryService>(BranchCategoryService);

    const result = await service.updateStatus(
      fakeBranchInactiveCategory.id,
      params,
    );

    expect(result).toBeUndefined();
  });

  it('should be ok if inactive branch category', async () => {
    const params = {
      isActive: 0,
    };
    const category: CategoryEntity = plainToInstance(CategoryEntity, {
      id: 1,
      title: '{"en":"category title"}',
      isActive: 1,
    });

    // mock getRepository(CategoryEntity)
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
            getRawOne: jest.fn().mockResolvedValue(category),
          })),
        };
      });

    // mock getRepository(BranchInactiveCategoryEntity)
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

    service = module.get<BranchCategoryService>(BranchCategoryService);

    const result = await service.updateStatus(category.id, params);

    expect(result).toBeUndefined();
  });

  it('should throw exception if delete error', async () => {
    const fakeBranchInactiveCategory = {
      id: 1,
      title: '{"en":"category title"}',
      is_active: 1,
      inactive_id: 1,
      inactive_category_id: 1,
      inactive_branch_id: 10,
    };

    const params = {
      isActive: 1,
      branchId: fakeBranchInactiveCategory.inactive_branch_id,
    };

    // mock getRepository(CategoryEntity)
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
            getRawOne: jest.fn().mockResolvedValue(fakeBranchInactiveCategory),
          })),
        };
      });

    // mock getRepository(BranchInactiveCategoryEntity)
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

    service = module.get<BranchCategoryService>(BranchCategoryService);

    try {
      await service.updateStatus(fakeBranchInactiveCategory.id, params);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(506001);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BRANCH_INACTIVE_CATEGORY_DELETE_ERROR',
      );
    }
  });

  it('should throw exception if create error', async () => {
    const params = {
      isActive: 0,
    };
    const category: CategoryEntity = plainToInstance(CategoryEntity, {
      id: 1,
      title: '{"en":"category title"}',
      isActive: 1,
    });

    // mock getRepository(CategoryEntity)
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
            getRawOne: jest.fn().mockResolvedValue(category),
          })),
        };
      });

    // mock getRepository(BranchInactiveCategoryEntity)
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

    service = module.get<BranchCategoryService>(BranchCategoryService);

    try {
      await service.updateStatus(category.id, params);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(506002);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BRANCH_INACTIVE_CATEGORY_CREATE_ERROR',
      );
    }
  });
});
