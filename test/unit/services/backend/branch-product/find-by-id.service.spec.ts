import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { AppConfigService } from 'src/config/app/config.service';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { get } from 'lodash';
import { BranchProductService } from '@services/backend/branch-product.service';
import { ProductEntity } from '@entities/tenant/products.entity';

describe('BranchProductService -> findById', () => {
  const sharedTestProviders = [
    BranchProductService,
    {
      provide: AppConfigService,
      useValue: {},
    },
  ];

  let service: BranchProductService;
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
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue(product),
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

    service = module.get<BranchProductService>(BranchProductService);

    const result = await service.findById(product.id, {});

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
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue(null),
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

    service = module.get<BranchProductService>(BranchProductService);

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
