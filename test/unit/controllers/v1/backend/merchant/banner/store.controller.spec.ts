import { Test, TestingModule } from '@nestjs/testing';
import { BannerService } from '@services/backend/merchant/banner.service';
import { BannerEntity } from '@entities/tenant/banner.entity';
import { BannerStoreController } from '@controller/v1/backend/merchant/banner/banner-store.controller';
import { plainToInstance } from 'class-transformer';
import { BannerStoreDto } from '@dtos/v1/backend/merchant/banner/banner-store.dto';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { get } from 'lodash';
import { BannerLinkEnum } from '@enums/banner-link';

describe('BannerStoreController', () => {
  process.env.AWS_S3_URL = 'https://localhost.com';

  let controller: BannerStoreController;
  let service: BannerService;
  let storeMethod: jest.SpyInstance<
    Promise<BannerEntity>,
    [parameters: BannerStoreDto]
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NestjsFormDataModule],
      controllers: [BannerStoreController],
      providers: [
        {
          provide: BannerService,
          useValue: {
            store: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BannerStoreController>(BannerStoreController);
    service = module.get<BannerService>(BannerService);
    storeMethod = jest.spyOn(service, 'store');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('store should be ok', async () => {
    const bannerDto: BannerStoreDto = plainToInstance(BannerStoreDto, {
      title: 'แบนเนอร์ 1',
      linkType: BannerLinkEnum.EXTERNAL,
      linkTo: 'https://google.co.th',
      startDate: '2022-09-27 17:19:00',
      endDate: '2023-10-27 17:19:59',
      image: 'banner/images/18bb8134-2ae2-4d80-8a5f-0d4548edc28a.jpeg',
      isActive: 1,
      ordinal: 2,
    });

    const storeBanner: BannerEntity = plainToInstance(BannerEntity, {
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

    storeMethod.mockResolvedValue(storeBanner);

    const response = await controller.store(bannerDto);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(get(response, 'data.id')).toEqual(storeBanner.id);
    expect(get(response, 'data.link')).toEqual(storeBanner.link);
  });

  it('throw exception', async (done) => {
    const bannerDto: BannerStoreDto = plainToInstance(BannerStoreDto, {
      title: 'แบนเนอร์ 1',
      linkType: '',
      linkTo: 'https://google.co.th',
      startDate: '2022-09-27 17:19:00',
      endDate: '2023-10-27 17:19:59',
      image: 'banner/images/18bb8134-2ae2-4d80-8a5f-0d4548edc28a.jpeg',
      isActive: 1,
      ordinal: 2,
    });

    storeMethod.mockRejectedValue(new Error('error'));

    try {
      await controller.store(bannerDto);
    } catch (error) {
      done();
    }
  });
});
