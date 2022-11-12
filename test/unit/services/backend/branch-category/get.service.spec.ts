import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { AppConfigService } from 'src/config/app/config.service';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { BranchCategoryService } from '@services/backend/branch-category.service';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginateRaw: jest.fn().mockResolvedValue({
    items: [
      {
        categories_id: '1',
        categories_title: '{"th":"เทส","en":"test 1"}',
        categories_is_active: 1,
        categories_ordinal: 1,
        categories_created_at: new Date(),
        categories_updated_at: new Date(),
        categories_deleted_at: null,
        inactive_id: null,
        inactive_category_id: null,
        inactive_branch_id: null,
        productcount: '4',
      },
      {
        categories_id: '2',
        categories_title: '{"th":"เทส","en":"test 2"}',
        categories_is_active: 1,
        categories_ordinal: 2,
        categories_created_at: new Date(),
        categories_updated_at: new Date(),
        categories_deleted_at: null,
        inactive_id: null,
        inactive_category_id: null,
        inactive_branch_id: null,
        productcount: '2',
      },
    ],
    meta: {
      totalItems: 2,
      itemCount: 2,
      itemsPerPage: 30,
      totalPages: 1,
      currentPage: 1,
    },
    links: {
      first: 'http://sr-api.test/branch-categories?limit=30',
      previous: '',
      next: '',
      last: 'http://sr-api.test/branch-categories?page=1&limit=30',
    },
  }),
}));

describe('BranchCategoryService -> get', () => {
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
    // mock getRepository(CategoryEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            where: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
            addGroupBy: jest.fn().mockReturnThis(),
            innerJoin: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
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

    const params = {
      appends: 'productCount',
    };

    const result = await service.get(1, params);

    expect(result.items).toBeDefined();
    expect(result.meta).toBeDefined();
    expect(result.items.length).toEqual(2);
  });

  it('should be ok with search', async () => {
    // mock getRepository(CategoryEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            where: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
            addGroupBy: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
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

    const params = {
      filters: {
        search: 'test',
      },
      page: 1,
      perPage: 30,
    };

    const result = await service.get(1, params);

    expect(result.items).toBeDefined();
    expect(result.meta).toBeDefined();
    expect(result.items.length).toEqual(2);
  });
});
