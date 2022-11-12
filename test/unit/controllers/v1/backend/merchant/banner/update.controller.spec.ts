import { Test, TestingModule } from '@nestjs/testing';
import { BannerService } from '@services/backend/merchant/banner.service';
import { BannerEntity } from '@entities/tenant/banner.entity';
import { BannerUpdateController } from '@controller/v1/backend/merchant/banner/banner-update.controller';
import { plainToInstance } from 'class-transformer';
import { BannerUpdateDto } from '@dtos/v1/backend/merchant/banner/banner-update.dto';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { get } from 'lodash';
import { BannerLinkEnum } from '@enums/banner-link';

describe('BannerUpdateController', () => {
  process.env.AWS_S3_URL = 'https://localhost.com';

  let controller: BannerUpdateController;
  let service: BannerService;
  let updateMethod: jest.SpyInstance<
    Promise<BannerEntity>,
    [id: number, parameters: BannerUpdateDto]
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NestjsFormDataModule],
      controllers: [BannerUpdateController],
      providers: [
        {
          provide: BannerService,
          useValue: {
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BannerUpdateController>(BannerUpdateController);
    service = module.get<BannerService>(BannerService);
    updateMethod = jest.spyOn(service, 'update');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('update should be ok', async () => {
    const bannerDto: BannerUpdateDto = plainToInstance(BannerUpdateDto, {
      title: 'แบนเนอร์ 1111111111',
      linkType: BannerLinkEnum.EXTERNAL,
      linkTo: 'https://google.co.th',
      startDate: '2022-09-27 17:19:00',
      endDate: '2023-10-27 17:19:59',
      image: 'banner/images/18bb8134-2ae2-4d80-8a5f-0d4548edc28a.jpeg',
      isActive: 1,
      ordinal: 2,
    });

    const mockBanner: BannerEntity = plainToInstance(BannerEntity, {
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

    updateMethod.mockResolvedValue(mockBanner);

    const response = await controller.update(1, bannerDto);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(get(response, 'data.id')).toEqual(mockBanner.id);
    expect(get(response, 'data.title')).toEqual(mockBanner.title);
  });

  it('throw exception', async (done) => {
    const bannerDto: BannerUpdateDto = plainToInstance(BannerUpdateDto, {
      title: 'แบนเนอร์ 1',
      linkType: '',
      linkTo: 'https://google.co.th',
      startDate: '2022-09-27 17:19:00',
      endDate: '2023-10-27 17:19:59',
      image: 'banner/images/18bb8134-2ae2-4d80-8a5f-0d4548edc28a.jpeg',
      isActive: 1,
      ordinal: 2,
    });

    updateMethod.mockRejectedValue(new Error('error'));

    try {
      await controller.update(1, bannerDto);
    } catch (error) {
      done();
    }
  });
});
