import { Test, TestingModule } from '@nestjs/testing';
import { BannerUpdateOrdinalController } from '@controller/v1/backend/merchant/banner/banner-update-ordinal.controller';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';
import { BannerService } from '@services/backend/merchant/banner.service';
import { UpdateOrdinalDto } from '@dtos/v1/backend/update-ordinal.dto';

describe('BannerUpdateOrdinalController', () => {
  let controller: BannerUpdateOrdinalController;
  let bannerService: BannerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [BannerUpdateOrdinalController],
      providers: [
        {
          provide: BannerService,
          useValue: {
            updateOrdinal: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BannerUpdateOrdinalController>(
      BannerUpdateOrdinalController,
    );
    bannerService = module.get<BannerService>(BannerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    const mockDto = plainToInstance(UpdateOrdinalDto, {
      ordinal: [
        { id: 1, ordinal: 1 },
        { id: 2, ordinal: 2 },
      ],
    });

    jest.spyOn(bannerService, 'updateOrdinal').mockResolvedValue();

    const response = await controller.updateOrdinal(mockDto);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(bannerService.updateOrdinal).toBeCalledWith(mockDto);
  });

  it('throw exception', async (done) => {
    jest
      .spyOn(bannerService, 'updateOrdinal')
      .mockRejectedValue(new Error('error'));

    const mockDto = plainToInstance(UpdateOrdinalDto, {
      ordinal: [
        { id: 1, ordinal: 1 },
        { id: 2, ordinal: 2 },
      ],
    });

    try {
      await controller.updateOrdinal(mockDto);
    } catch (error) {
      done();
    }
  });
});
