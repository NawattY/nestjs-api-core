import { BannerEntity } from '@entities/tenant/banner.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { BannerGetController } from '@controller/v1/frontend/banner/banner-get.controller';
import { BannerService } from '@services/frontend/banner.service';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';

describe('BannerGetController', () => {
  process.env.AWS_S3_URL = 'https://localhost.com';
  const mockBranchId = 1;
  let controller: BannerGetController;
  let bannerService: BannerService;
  let getMethod: jest.SpyInstance<Promise<any[]>, [branchId: number]>;

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
    const banners = [
      plainToInstance(BannerEntity, {
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
      }),
      plainToInstance(BannerEntity, {
        id: 2,
        title: 'แบนเนอร์ 2',
        link: '{"type":"external","value":"https://google.co.th"}',
        startDate: null,
        endDate: null,
        image: 'banner/images/18bb8134-2ae2-4d80-8a5f-0d4548edc28a.jpeg',
        isActive: 1,
        ordinal: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }),
    ];

    getMethod.mockResolvedValue(banners);

    const response = await controller.get(mockBranchId);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(get(response, 'data').length).toBe(banners.length);
  });

  it('throw exception', async (done) => {
    getMethod.mockRejectedValue(new Error('error'));

    try {
      await controller.get(mockBranchId);
    } catch (error) {
      done();
    }
  });
});
