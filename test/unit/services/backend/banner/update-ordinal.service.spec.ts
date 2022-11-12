import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { UpdateOrdinalDto } from '@dtos/v1/backend/update-ordinal.dto';
import { AppConfigService } from 'src/config/app/config.service';
import { S3Service } from '@appotter/nestjs-s3';
import { UploadFile } from '@helpers/upload-file.helper';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { get } from 'lodash';
import { BannerService } from '@services/backend/merchant/banner.service';

describe('BannerService -> update ordinal', () => {
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
    const mockDto: UpdateOrdinalDto = plainToInstance(UpdateOrdinalDto, {
      ordinal: [
        {
          id: 1,
          ordinal: 1,
        },
        {
          id: 2,
          ordinal: 2,
        },
      ],
    });

    // mock getRepository(BannerEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
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

    const result = await service.updateOrdinal(mockDto);

    expect(result).toBeUndefined();
  });

  it('should throw exception if banner update ordinal error', async () => {
    const mockDto: UpdateOrdinalDto = plainToInstance(UpdateOrdinalDto, {
      ordinal: [
        {
          id: 1,
          ordinal: 1,
        },
        {
          id: 2,
          ordinal: 2,
        },
      ],
    });

    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
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
      await service.updateOrdinal(mockDto);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(501003);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BANNER_UPDATE_ERROR',
      );
    }
  });
});
