import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { AppConfigService } from 'src/config/app/config.service';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { BranchProductService } from '@services/backend/branch-product.service';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginateRaw: jest.fn().mockResolvedValue({
    items: [
      {
        id: '1',
        title: '{"th":"สินค้า 1","en":"product 1"}',
        detail: '{"th":"รายละเอียด 1","en":"detail 1"}',
        image: 'product/images/product1.png',
        is_active: 1,
        ordinal: 1,
        special_price: null,
        normal_price: '100.0000',
        status: 1,
        out_of_stock: 0,
        is_recommend: 0,
        category_branch_is_active: 1,
        category_id: 1,
        category_title: '{"th":"หมวดหมู่ 1","en":"category 1"}',
      },
      {
        id: '2',
        title: '{"th":"สินค้า 2","en":"product 2"}',
        detail: '{"th":"รายละเอียด 2","en":"detail 2"}',
        image: 'product/images/product2.png',
        is_active: 1,
        ordinal: 2,
        special_price: null,
        normal_price: '100.0000',
        status: 1,
        out_of_stock: 0,
        is_recommend: 0,
        category_branch_is_active: 1,
        category_id: 1,
        category_title: '{"th":"หมวดหมู่ 1","en":"category 1"}',
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
      first: 'https://api.test/branch-products?limit=30',
      previous: '',
      next: '',
      last: 'https://api.test/branch-products?page=1&limit=30',
    },
  }),
}));

describe('BranchProductService -> get', () => {
  const sharedTestProviders = [
    BranchProductService,
    {
      provide: AppConfigService,
      useValue: {},
    },
  ];

  let service: BranchProductService;
  let fakeMerchantConnection: Partial<Connection>;

  beforeEach(async () => {
    fakeMerchantConnection = {
      getRepository: jest.fn(),
    };
  });

  it('should be ok', async () => {
    // mock getRepository(ProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            select: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
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

    service = module.get<BranchProductService>(BranchProductService);

    const result = await service.get(1, {});

    expect(result.items).toBeDefined();
    expect(result.meta).toBeDefined();
    expect(result.items.length).toEqual(2);
  });

  it('should be ok with search', async () => {
    // mock getRepository(ProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            select: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
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

    service = module.get<BranchProductService>(BranchProductService);

    const params = {
      filters: {
        search: 'product',
        categoryId: 1,
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
