import { S3Service } from '@appotter/nestjs-s3';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { UploadFile } from '@helpers/upload-file.helper';
import { Test } from '@nestjs/testing';
import { AppConfigService } from 'src/config/app/config.service';
import { Connection } from 'typeorm';
import { CategoryService } from '@services/backend/category.service';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginateRaw: jest.fn().mockResolvedValue({
    items: [
      {
        id: 1,
        title: '{"th":"เทส","en":"Test 1"}',
        ordinal: 1,
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 2,
        title: '{"th":"เทส","en":"Test 2"}',
        ordinal: 1,
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
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
      first: 'http://localhost:3005/v1/backend/categories?limit=30',
      previous: '',
      next: '',
      last: 'http://localhost:3005/v1/backend/categories?page=1&limit=30',
    },
  }),
}));

describe('Backend -> CategoryService -> get', () => {
  const sharedTestProviders = [
    CategoryService,
    {
      provide: AppConfigService,
      useValue: {},
    },
    {
      provide: UploadFile,
      useValue: {},
    },
    {
      provide: S3Service,
      useValue: {},
    },
  ];

  let service: CategoryService;
  let fakeMerchantConnection: Partial<Connection>;

  beforeEach(async () => {
    fakeMerchantConnection = {
      getRepository: jest.fn(),
    };
  });

  it('should be ok', async () => {
    // mock getRepository(CategoryService)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            orderBy: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            addGroupBy: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
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

    service = module.get<CategoryService>(CategoryService);

    const result = await service.get({
      page: '1',
      perPage: '30',
      appends: 'productCount',
    });

    expect(result.items).toBeDefined();
    expect(result.meta).toBeDefined();
    expect(result.items.length).toEqual(2);
  });

  it('should be ok with search', async () => {
    // mock getRepository(CategoryService)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            orderBy: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
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

    service = module.get<CategoryService>(CategoryService);

    const dtoWithSearch = { filters: { search: 'Test' } };
    const result = await service.get({
      page: '1',
      perPage: '30',
      ...dtoWithSearch,
    });

    expect(result.items).toBeDefined();
    expect(result.meta).toBeDefined();
    expect(result.items.length).toEqual(2);
  });
});
