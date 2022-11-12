import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { BranchService } from '@services/backend/branch.service';
import { AppConfigService } from 'src/config/app/config.service';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockResolvedValue({
    items: [
      {
        id: 1,
        title: '{"th":"เทส","en":"Test 1"}',
        detail: '{"th":"เทส","en":"Test 1"}',
        phone: '0891111111',
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: '{"th":"เทส 2","en":"Test 2"}',
        detail: '{"th":"เทส 2","en":"Test 2"}',
        phone: '0891111111',
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
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
      first: 'http://localhost:3005/v1/backend/branch?limit=30',
      previous: '',
      next: '',
      last: 'http://localhost:3005/v1/backend/branch?page=1&limit=30',
    },
  }),
}));
describe('Backend -> BranchService -> Get', () => {
  let fakeMerchantConnection: Partial<Connection>;
  let fakeBranchService: BranchService;

  beforeEach(async () => {
    fakeMerchantConnection = {
      getRepository: jest.fn(),
    };
  });

  it('should be defined', async () => {
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

    fakeBranchService = module.get<BranchService>(BranchService);
    expect(fakeBranchService).toBeDefined();
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
            orderBy: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            orWhere: jest.fn().mockReturnThis(),
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

    fakeBranchService = module.get<BranchService>(BranchService);

    const branch = await fakeBranchService.get({ page: '1', perPage: '30' });

    expect(branch.items).toBeDefined();
    expect(branch.meta).toBeDefined();
    expect(branch.items.length).toEqual(2);
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
            orderBy: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            orWhere: jest.fn().mockReturnThis(),
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

    fakeBranchService = module.get<BranchService>(BranchService);
    const dtoWithSearch = { filters: { search: 'test' } };
    const branch = await fakeBranchService.get({
      page: '1',
      perPage: '30',
      ...dtoWithSearch,
    });

    expect(branch.items).toBeDefined();
    expect(branch.meta).toBeDefined();
    expect(branch.items.length).toEqual(2);
  });
});
