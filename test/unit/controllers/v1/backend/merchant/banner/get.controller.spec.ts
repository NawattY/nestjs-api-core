import { BannerEntity } from '@entities/tenant/banner.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { BannerGetController } from '@controller/v1/backend/merchant/banner/banner-get.controller';
import { BannerService } from '@services/backend/merchant/banner.service';
import { plainToInstance } from 'class-transformer';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { BannerResource } from '@resources/backend/merchant/banner/banner.resource';
import { get } from 'lodash';

describe('BannerGetController', () => {
  process.env.AWS_S3_URL = 'https://localhost.com';

  let controller: BannerGetController;
  let bannerService: BannerService;
  let getMethod:
    | jest.SpyInstance<
        Promise<Pagination<BannerEntity, IPaginationMeta>>,
        [parameters?: any]
      >
    | {
        (arg0: BannerResource, arg1: string): any;
        mockImplementation: (arg0: () => any) => void;
        mockRejectedValue: (arg0: Error) => void;
      };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [BannerGetController],
      providers: [
        {
          provide: BannerService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BannerGetController>(BannerGetController);
    bannerService = module.get<BannerService>(BannerService);
    getMethod = jest.spyOn(bannerService, 'get');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    getMethod.mockImplementation((): any => {
      const bannerA: BannerEntity = plainToInstance(BannerEntity, {
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

      const bannerB: BannerEntity = plainToInstance(BannerEntity, {
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

      const bannerC: BannerEntity = plainToInstance(BannerEntity, {
        id: 3,
        title: 'แบนเนอร์ 3',
        link: '{"type":"external","value":"https://google.co.th"}',
        startDate: null,
        endDate: '2023-10-27 17:19:59',
        image: 'banner/images/18bb8134-2ae2-4d80-8a5f-0d4548edc28a.jpeg',
        isActive: 1,
        ordinal: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      return Promise.resolve({
        items: [bannerA, bannerB, bannerC],
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

    const response = await controller.get(1);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(bannerService.get).toBeCalledWith(1);
  });

  it('throw exception', async (done) => {
    getMethod.mockRejectedValue(new Error('error'));

    try {
      await controller.get(1);
    } catch (error) {
      done();
    }
  });
});
