import { Test, TestingModule } from '@nestjs/testing';
import { BannerUpdateStatusController } from '@controller/v1/backend/merchant/banner/banner-update-status.controller';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';
import { BannerService } from '@services/backend/merchant/banner.service';
import { UpdateStatusDto } from '@dtos/v1/backend/update-status.dto';

describe('BannerUpdateStatusController', () => {
  let controller: BannerUpdateStatusController;
  let bannerService: BannerService;
  let updateStatusMethod: jest.SpyInstance<
    Promise<void>,
    [id: number, isActive: number]
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [BannerUpdateStatusController],
      providers: [
        {
          provide: BannerService,
          useValue: {
            updateStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BannerUpdateStatusController>(
      BannerUpdateStatusController,
    );
    bannerService = module.get<BannerService>(BannerService);
    updateStatusMethod = jest.spyOn(bannerService, 'updateStatus');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    const mockDto = plainToInstance(UpdateStatusDto, {
      isActive: 1,
    });

    updateStatusMethod.mockResolvedValue();

    const response = await controller.updateStatus(1, mockDto);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(bannerService.updateStatus).toBeCalledWith(1, 1);
  });

  it('throw exception', async (done) => {
    updateStatusMethod.mockRejectedValue(new Error('error'));

    const mockDto = plainToInstance(UpdateStatusDto, {
      isActive: 1,
    });

    try {
      await controller.updateStatus(1, mockDto);
    } catch (error) {
      done();
    }
  });
});
