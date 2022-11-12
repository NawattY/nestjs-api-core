import { BannerEntity } from '@entities/tenant/banner.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { BannerShowController } from '@controller/v1/backend/merchant/banner/banner-show.controller';
import { BannerService } from '@services/backend/merchant/banner.service';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';

describe('BannerShowController', () => {
  process.env.AWS_S3_URL = 'https://localhost.com';

  let controller: BannerShowController;
  let bannerService: BannerService;
  let findByIdMethod: jest.SpyInstance<Promise<BannerEntity>, [id: number]>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [BannerShowController],
      providers: [
        {
          provide: BannerService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BannerShowController>(BannerShowController);
    bannerService = module.get<BannerService>(BannerService);
    findByIdMethod = jest.spyOn(bannerService, 'findById');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    const banner: BannerEntity = plainToInstance(BannerEntity, {
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

    findByIdMethod.mockResolvedValue(banner);

    const response = await controller.show(1);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(get(response, 'data.id')).toEqual(banner.id);
    expect(bannerService.findById).toBeCalledWith(1);
  });

  it('throw exception', async (done) => {
    findByIdMethod.mockRejectedValue(new Error('error'));

    try {
      await controller.show(1);
    } catch (error) {
      done();
    }
  });
});
