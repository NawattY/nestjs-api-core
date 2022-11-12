import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { AppConfigService } from 'src/config/app/config.service';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { S3Service } from '@appotter/nestjs-s3';
import { UploadFile } from '@helpers/upload-file.helper';
import { ProductService } from '@services/backend/merchant/product.service';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockResolvedValue({
    items: [
      {
        id: '1',
        title: '{"th":"สินค้า 2","en":"product 2"}',
        detail: '{"th":"รายละเอียด 2","en":"detail 2"}',
        normalPrice: '100.0000',
        specialPrice: null,
        categoryId: 1,
        image: 'product/images/product1.png',
        isActive: 1,
        ordinal: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: 1,
          title: '{"th":"หมวดหมู่ 1","en":"category 1"}',
          isActive: 1,
        },
      },
      {
        id: '2',
        title: '{"th":"หมวดหมู่ 1","en":"product 2"}',
        detail: '{"th":"รายละเอียด 2","en":"detail 2"}',
        normalPrice: '100.0000',
        specialPrice: null,
        categoryId: 1,
        image: 'product/images/product2.png',
        isActive: 1,
        ordinal: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: 1,
          title: '{"th":"หมวดหมู่ 1","en":"category 1"}',
          isActive: 1,
        },
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
      first: 'https://api.test/products?limit=30',
      previous: '',
      next: '',
      last: 'https://api.test/products?page=1&limit=30',
    },
  }),
}));

describe('ProductService -> get', () => {
  const sharedTestProviders = [
    ProductService,
    {
      provide: AppConfigService,
      useValue: {},
    },
    {
      provide: S3Service,
      useValue: {},
    },
    {
      provide: UploadFile,
      useValue: {},
    },
  ];

  let service: ProductService;
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
            orderBy: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
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

    service = module.get<ProductService>(ProductService);
    const params = {
      include: 'category',
    };

    const result = await service.get(params);

    expect(result.items).toBeDefined();
    expect(result.meta).toBeDefined();
    expect(result.items.length).toEqual(2);
  });

  it('should be ok with search category', async () => {
    // mock getRepository(ProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            orderBy: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
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

    service = module.get<ProductService>(ProductService);
    const params = {
      filters: {
        categoryId: 1,
      },
    };

    const result = await service.get(params);

    expect(result.items).toBeDefined();
    expect(result.meta).toBeDefined();
    expect(result.items.length).toEqual(2);
  });

  it('should be ok with search title', async () => {
    // mock getRepository(ProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            orderBy: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
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

    service = module.get<ProductService>(ProductService);
    const params = {
      filters: {
        search: 'product',
      },
    };

    const result = await service.get(params);

    expect(result.items).toBeDefined();
    expect(result.meta).toBeDefined();
    expect(result.items.length).toEqual(2);
  });
});
