import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { AppConfigService } from 'src/config/app/config.service';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { BranchBannerService } from '@services/backend/branch-banner.service';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginateRaw: jest.fn().mockResolvedValue({
    items: [
      {
        banners_id: 1,
        banners_title: 'banner 1',
        banners_link: '{"type":"none"}',
        banners_image: 'banner/images/01.jpg',
        banners_ordinal: 1,
        banners_is_active: 1,
      },
      {
        banners_id: 2,
        banners_title: 'banner 2',
        banners_link: '{"type":"none"}',
        banners_image: 'banner/images/02.jpg',
        banners_ordinal: 1,
        banners_is_active: 1,
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
      first: 'http://sr-api.test/branch-banners?limit=30',
      previous: '',
      next: '',
      last: 'http://sr-api.test/branch-banners?page=1&limit=30',
    },
  }),
}));

describe('BranchBannerService -> get', () => {
  const sharedTestProviders = [
    BranchBannerService,
    {
      provide: AppConfigService,
      useValue: {},
    },
  ];

  let service: BranchBannerService;
  let fakeMerchantConnection: Partial<Connection>;

  beforeEach(async () => {
    fakeMerchantConnection = {
      getRepository: jest.fn(),
    };
  });

  it('should be ok', async () => {
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
            orderBy: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            addGroupBy: jest.fn().mockReturnThis(),
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

    service = module.get<BranchBannerService>(BranchBannerService);

    const result = await service.get(1);

    expect(result.items).toBeDefined();
    expect(result.meta).toBeDefined();
    expect(result.items.length).toEqual(2);
  });

  it('should be ok with search', async () => {
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
            orderBy: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
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

    service = module.get<BranchBannerService>(BranchBannerService);
    const params = {
      filters: {
        search: 'banner',
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
