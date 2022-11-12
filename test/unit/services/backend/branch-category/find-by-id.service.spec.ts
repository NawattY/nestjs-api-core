import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { AppConfigService } from 'src/config/app/config.service';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { get } from 'lodash';
import { BranchCategoryService } from '@services/backend/branch-category.service';
import { CategoryEntity } from '@entities/tenant/categories.entity';

describe('BranchCategoryService -> findById', () => {
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

  it('should be ok', async () => {
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

    const result = await service.findById(category.id, 1);

    expect(result.id).toEqual(category.id);
  });

  it('should throw exception if category not found', async () => {
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

    service = module.get<BranchCategoryService>(BranchCategoryService);

    try {
      await service.findById(1, 1);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(600002);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'CATEGORY_NOT_FOUND',
      );
    }
  });
});
