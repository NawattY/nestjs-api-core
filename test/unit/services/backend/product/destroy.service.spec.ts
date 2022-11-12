import { Test } from '@nestjs/testing';
import { Connection, UpdateResult } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { AppConfigService } from 'src/config/app/config.service';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { get } from 'lodash';
import { ProductEntity } from '@entities/tenant/products.entity';
import { S3Service } from '@appotter/nestjs-s3';
import { UploadFile } from '@helpers/upload-file.helper';
import { ProductService } from '@services/backend/merchant/product.service';

describe('ProductService -> destroy', () => {
  const sharedTestProviders = [
    ProductService,
    {
      provide: AppConfigService,
      useValue: {},
    },
    {
      provide: S3Service,
      useValue: {},
    },
    {
      provide: UploadFile,
      useValue: {},
    },
  ];

  let service: ProductService;
  let fakeMerchantConnection: Partial<Connection>;

  beforeEach(async () => {
    fakeMerchantConnection = {
      getRepository: jest.fn(),
    };
  });

  it('should be ok', async () => {
    const product: ProductEntity = plainToInstance(ProductEntity, {
      id: 1,
      title: '{"en":"product title"}',
      isActive: 1,
    });

    const updateResult: UpdateResult = {
      generatedMaps: [],
      raw: [],
      affected: 1,
    };

    // mock getRepository(ProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(product),
          })),
          softDelete: jest.fn().mockResolvedValue(updateResult),
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

    service = module.get<ProductService>(ProductService);

    const result = await service.destroy(product.id);

    expect(result).toBeUndefined();
  });

  it('should throw exception if product not found', async () => {
    // mock getRepository(ProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(null),
          })),
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

    service = module.get<ProductService>(ProductService);

    try {
      await service.destroy(1);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(800001);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'PRODUCT_NOT_FOUND',
      );
    }
  });

  it('should throw exception if delete product error', async () => {
    const product: ProductEntity = plainToInstance(ProductEntity, {
      id: 1,
      title: '{"en":"product title"}',
      isActive: 1,
    });

    // mock getRepository(ProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(product),
          })),
          softDelete: jest.fn().mockRejectedValue(new Error('error')),
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

    service = module.get<ProductService>(ProductService);

    try {
      await service.destroy(1);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(800003);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'PRODUCT_DELETE_ERROR',
      );
    }
  });
});
