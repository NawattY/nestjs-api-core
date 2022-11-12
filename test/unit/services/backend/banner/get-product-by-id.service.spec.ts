import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { AppConfigService } from 'src/config/app/config.service';
import { S3Service } from '@appotter/nestjs-s3';
import { UploadFile } from '@helpers/upload-file.helper';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { get } from 'lodash';
import { BannerService } from '@services/backend/merchant/banner.service';
import { ProductEntity } from '@entities/tenant/products.entity';

describe('BannerService -> update status', () => {
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
    const product: ProductEntity = plainToInstance(ProductEntity, {
      id: 1,
      title: '{"th":"ใบไม้ขึ้นหัวแล้วนะ","en":"Test 1"}',
      detail: '{"th":"สีเขียวสดใส หมาน่ารักมาก","en":"Color green"}',
      categoryId: 4,
      image: 'product/images/19f10171-895b-4558-afef-6fd7f001b3e9.png',
      isActive: 1,
      ordinal: 2,
      specialPrice: 0,
      normalPrice: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    // mock getRepository(BannerEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
        };
      });

    // mock getRepository(ProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(product),
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

    const result = await service.getProductById(product.id);
    expect(result.id).toEqual(product.id);
  });

  it('should throw exception if banner update ordinal error', async () => {
    // mock getRepository(BannerEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
        };
      });

    // mock getRepository(ProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(null),
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
      await service.getProductById(999);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(800001);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'PRODUCT_NOT_FOUND',
      );
    }
  });
});
