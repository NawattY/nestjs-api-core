import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { UpdateStatusDto } from '@dtos/v1/backend/update-status.dto';
import { AppConfigService } from 'src/config/app/config.service';
import { S3Service } from '@appotter/nestjs-s3';
import { UploadFile } from '@helpers/upload-file.helper';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { get } from 'lodash';
import { BannerService } from '@services/backend/merchant/banner.service';
import { BannerLinkEnum } from '@enums/banner-link';
import { BannerEntity } from '@entities/tenant/banner.entity';

describe('BannerService -> get', () => {
  const sharedTestProviders = [
    BannerService,
    {
      provide: AppConfigService,
      useValue: {},
    },
    {
      provide: UploadFile,
      useValue: {},
    },
    {
      provide: S3Service,
      useValue: {},
    },
  ];

  let service: BannerService;
  let fakeMerchantConnection: Partial<Connection>;

  beforeEach(async () => {
    fakeMerchantConnection = {
      getRepository: jest.fn(),
    };
  });

  it('should be ok', async () => {
    const mockDto: UpdateStatusDto = plainToInstance(UpdateStatusDto, {
      isActive: 1,
    });

    const banner: BannerEntity = plainToInstance(BannerEntity, {
      id: 1,
      title: 'banner title',
      startDate: '2022-09-27 17:19:00',
      endDate: '2022-09-27 17:19:00',
      linkType: BannerLinkEnum.PRODUCT,
      linkTo: 'https://google.co.th',
      image: 'http://image.jpg',
      isActive: 1,
    });

    // mock getRepository(BannerEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(banner),
          update: jest.fn(),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        ...sharedTestProviders,
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
      ],
    }).compile();

    service = module.get<BannerService>(BannerService);

    const result = await service.updateStatus(1, mockDto.isActive);

    expect(result).toBeUndefined();
  });

  it('should throw exception if banner update status error', async () => {
    const mockDto: UpdateStatusDto = plainToInstance(UpdateStatusDto, {
      isActive: 1,
    });

    const banner: BannerEntity = plainToInstance(BannerEntity, {
      id: 1,
      title: 'banner title',
      startDate: '2022-09-27 17:19:00',
      endDate: '2022-09-27 17:19:00',
      linkType: BannerLinkEnum.PRODUCT,
      linkTo: 'https://google.co.th',
      image: 'http://image.jpg',
      isActive: 1,
    });

    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(banner),
          update: jest.fn().mockRejectedValue(new Error('error')),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        ...sharedTestProviders,
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
      ],
    }).compile();

    service = module.get<BannerService>(BannerService);

    try {
      await service.updateStatus(999, mockDto.isActive);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(501003);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BANNER_UPDATE_ERROR',
      );
    }
  });
});
