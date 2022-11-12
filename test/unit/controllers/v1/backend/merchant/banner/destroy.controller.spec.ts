import { Test, TestingModule } from '@nestjs/testing';
import { BannerDestroyController } from '@controller/v1/backend/merchant/banner/banner-destroy.controller';
import { get } from 'lodash';
import { BannerService } from '@services/backend/merchant/banner.service';

describe('BannerDestroyController', () => {
  let controller: BannerDestroyController;
  let bannerService: BannerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [BannerDestroyController],
      providers: [
        {
          provide: BannerService,
          useValue: {
            destroy: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BannerDestroyController>(BannerDestroyController);
    bannerService = module.get<BannerService>(BannerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    jest.spyOn(bannerService, 'destroy').mockResolvedValue();

    const response = await controller.destroy(1);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(bannerService.destroy).toBeCalledWith(1);
  });

  it('throw exception', async (done) => {
    jest.spyOn(bannerService, 'destroy').mockRejectedValue(new Error('error'));

    try {
      await controller.destroy(1);
    } catch (error) {
      done();
    }
  });
});
