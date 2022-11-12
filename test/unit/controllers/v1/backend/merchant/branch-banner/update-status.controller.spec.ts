import { Test, TestingModule } from '@nestjs/testing';
import { BranchBannerUpdateStatusController } from '@controller/v1/backend/merchant/branch-banner/branch-banner-update-status.controller';
import { get } from 'lodash';
import { BranchBannerService } from '@services/backend/branch-banner.service';

describe('BranchBannerUpdateStatusController', () => {
  let controller: BranchBannerUpdateStatusController;
  let bannerService: BranchBannerService;
  let updateStatusMethod: jest.SpyInstance<
    Promise<void>,
    [id: number, parameters?: any]
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [BranchBannerUpdateStatusController],
      providers: [
        {
          provide: BranchBannerService,
          useValue: {
            updateStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BranchBannerUpdateStatusController>(
      BranchBannerUpdateStatusController,
    );
    bannerService = module.get<BranchBannerService>(BranchBannerService);
    updateStatusMethod = jest.spyOn(bannerService, 'updateStatus');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    updateStatusMethod.mockResolvedValue();
    const response = await controller.updateStatus(
      1,
      { branchId: 1 },
      { isActive: 1 },
    );

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw exception', async (done) => {
    updateStatusMethod.mockRejectedValue(new Error('error'));

    try {
      await controller.updateStatus(1, { branchId: 1 }, { isActive: 1 });
    } catch (error) {
      done();
    }
  });
});
