import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { get } from 'lodash';
import { ProductEntity } from '@entities/tenant/products.entity';
import { ProductService } from '@services/frontend/product.service';
import { I18nService } from 'nestjs-i18n';

describe('ProductService -> findById', () => {
  const sharedTestProviders = [
    ProductService,
    {
      provide: I18nService,
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

    // mock getRepository(ProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(product),
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

    const result = await service.findById(product.id, { branchId: 1 });

    expect(result.id).toEqual(product.id);
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
            andWhere: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
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
      await service.findById(1, {});
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(800001);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'PRODUCT_NOT_FOUND',
      );
    }
  });
});
