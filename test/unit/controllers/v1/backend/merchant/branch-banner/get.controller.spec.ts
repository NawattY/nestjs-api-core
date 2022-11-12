import { BannerEntity } from '@entities/tenant/banner.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { BranchBannerGetController } from '@controller/v1/backend/merchant/branch-banner/branch-banner-get.controller';
import { BranchBannerService } from '@services/backend/branch-banner.service';
import { plainToInstance } from 'class-transformer';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { get } from 'lodash';

describe('BranchBannerGetController', () => {
  process.env.AWS_S3_URL = 'https://localhost.com';

  const mockBranchId = 1;
  const parameters = {
    page: 1,
    perPage: 30,
  };
  let controller: BranchBannerGetController;
  let bannerService: BranchBannerService;
  let getMethod: jest.SpyInstance<
    Promise<Pagination<BannerEntity, IPaginationMeta>>,
    [branchId: number, parameters?: any]
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [BranchBannerGetController],
      providers: [
        {
          provide: BranchBannerService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BranchBannerGetController>(
      BranchBannerGetController,
    );
    bannerService = module.get<BranchBannerService>(BranchBannerService);
    getMethod = jest.spyOn(bannerService, 'get');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    getMethod.mockImplementation((): any => {
      const masterBannerA: BannerEntity = plainToInstance(BannerEntity, {
        id: 1,
        title: 'แบนเนอร์ 1',
        link: '{"type":"external","value":"https://google.co.th"}',
        startDate: '2022-09-27 17:19:00',
        endDate: '2023-10-27 17:19:59',
        image: 'banner/images/18bb8134-2ae2-4d80-8a5f-0d4548edc28a.jpeg',
        isActive: 1,
        ordinal: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const masterBannerB: BannerEntity = plainToInstance(BannerEntity, {
        id: 2,
        title: 'แบนเนอร์ 2',
        link: '{"type":"external","value":"https://google.co.th"}',
        startDate: null,
        endDate: '2023-10-27 17:19:59',
        image: 'banner/images/18bb8134-2ae2-4d80-8a5f-0d4548edc28a.jpeg',
        isActive: 1,
        ordinal: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const masterBannerC: BannerEntity = plainToInstance(BannerEntity, {
        id: 3,
        title: 'แบนเนอร์ 3',
        link: '{"type":"external","value":"https://google.co.th"}',
        startDate: null,
        endDate: '2023-10-27 17:19:59',
        image: 'banner/images/18bb8134-2ae2-4d80-8a5f-0d4548edc28a.jpeg',
        isActive: 0,
        ordinal: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      return Promise.resolve({
        items: [masterBannerA, masterBannerB, masterBannerC],
        meta: {
          totalItems: 3,
          itemCount: 3,
          itemsPerPage: 30,
          totalPages: 1,
          currentPage: 1,
        },
        links: {},
      } as Pagination<BannerEntity>);
    });

    const response = await controller.get(mockBranchId, parameters);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw exception', async (done) => {
    getMethod.mockRejectedValue(new Error('error'));

    try {
      await controller.get(mockBranchId, parameters);
    } catch (error) {
      done();
    }
  });
});
