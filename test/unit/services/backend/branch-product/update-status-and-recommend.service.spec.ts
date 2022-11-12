import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { AppConfigService } from 'src/config/app/config.service';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { get } from 'lodash';
import { BranchProductService } from '@services/backend/branch-product.service';
import { ProductEntity } from '@entities/tenant/products.entity';
import { UpdateStatusParamsInterface } from '@interfaces/branch-product/update-status-params.interface';
import { BranchInactiveProductEntity } from '@entities/tenant/branch-inactive-products.entity';
import { BranchRecommendProductEntity } from '@entities/tenant/branch-recommend-products.entity';

describe('BranchProductService -> updateStatusAndRecommend', () => {
  const errorTest = new Error('error');
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

  it('should be ok if active product', async () => {
    const params: UpdateStatusParamsInterface = {
      branchId: 1,
      isActive: 1,
      isOutOfStock: 0,
    };

    const product: ProductEntity = plainToInstance(ProductEntity, {
      id: 1,
      title: '{"en":"product title"}',
      isActive: 1,
    });

    const branchInactiveProduct: BranchInactiveProductEntity = plainToInstance(
      BranchInactiveProductEntity,
      {
        id: 1,
        productId: product.id,
        branchId: 1,
        outOfStock: 0,
      },
    );

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

    // mock getRepository(BranchInactiveProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(branchInactiveProduct),
          delete: jest.fn().mockResolvedValue({ raw: 1 }),
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

    const result = await service.updateStatusAndRecommend(product.id, params);

    expect(result).toBeUndefined();
  });

  it('should be ok if inactive product', async () => {
    const params: UpdateStatusParamsInterface = {
      branchId: 1,
      isActive: 0,
      isOutOfStock: 0,
    };

    const product: ProductEntity = plainToInstance(ProductEntity, {
      id: 1,
      title: '{"en":"product title"}',
      isActive: 1,
    });

    const branchInactiveProduct: BranchInactiveProductEntity = plainToInstance(
      BranchInactiveProductEntity,
      {
        id: 1,
        productId: product.id,
        branchId: params.branchId,
        outOfStock: params.isOutOfStock,
      },
    );

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

    // mock getRepository(BranchInactiveProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(null),
          save: jest.fn().mockResolvedValue(branchInactiveProduct),
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

    const result = await service.updateStatusAndRecommend(product.id, params);

    expect(result).toBeUndefined();
  });

  it('should be ok if update out of stock', async () => {
    const params: UpdateStatusParamsInterface = {
      branchId: 1,
      isActive: 0,
      isOutOfStock: 0,
    };

    const product: ProductEntity = plainToInstance(ProductEntity, {
      id: 1,
      title: '{"en":"product title"}',
      isActive: 1,
    });

    const branchInactiveProduct: BranchInactiveProductEntity = plainToInstance(
      BranchInactiveProductEntity,
      {
        id: 1,
        productId: product.id,
        branchId: params.branchId,
        outOfStock: 1,
      },
    );

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

    // mock getRepository(BranchInactiveProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(branchInactiveProduct),
          update: jest.fn().mockResolvedValue({
            generatedMaps: [],
            raw: [],
            affected: 1,
          }),
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

    const result = await service.updateStatusAndRecommend(product.id, params);

    expect(result).toBeUndefined();
  });

  it('should be ok if recommend product', async () => {
    const params: UpdateStatusParamsInterface = {
      branchId: 1,
      isActive: 1,
      isOutOfStock: 0,
      isRecommend: 1,
    };

    const product: ProductEntity = plainToInstance(ProductEntity, {
      id: 1,
      title: '{"en":"product title"}',
      isActive: 1,
    });

    const branchRecommendProduct: BranchRecommendProductEntity =
      plainToInstance(BranchRecommendProductEntity, {
        id: 1,
        productId: product.id,
        branchId: params.branchId,
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

    // mock getRepository(BranchInactiveProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(null),
        };
      });

    // mock getRepository(BranchRecommendProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(null),
          save: jest.fn().mockResolvedValue(branchRecommendProduct),
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

    const result = await service.updateStatusAndRecommend(product.id, params);

    expect(result).toBeUndefined();
  });

  it('should be ok if not recommend product', async () => {
    const params: UpdateStatusParamsInterface = {
      branchId: 1,
      isActive: 1,
      isOutOfStock: 0,
      isRecommend: 0,
    };

    const product: ProductEntity = plainToInstance(ProductEntity, {
      id: 1,
      title: '{"en":"product title"}',
      isActive: 1,
    });

    const branchRecommendProduct: BranchRecommendProductEntity =
      plainToInstance(BranchRecommendProductEntity, {
        id: 1,
        productId: product.id,
        branchId: params.branchId,
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

    // mock getRepository(BranchInactiveProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(null),
        };
      });

    // mock getRepository(BranchRecommendProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(branchRecommendProduct),
          delete: jest.fn().mockResolvedValue({ raw: 1 }),
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

    const result = await service.updateStatusAndRecommend(product.id, params);

    expect(result).toBeUndefined();
  });

  it('should throw exception if active product error', async () => {
    const params: UpdateStatusParamsInterface = {
      branchId: 1,
      isActive: 1,
      isOutOfStock: 0,
    };

    const product: ProductEntity = plainToInstance(ProductEntity, {
      id: 1,
      title: '{"en":"product title"}',
      isActive: 1,
    });

    const branchInactiveProduct: BranchInactiveProductEntity = plainToInstance(
      BranchInactiveProductEntity,
      {
        id: 1,
        productId: product.id,
        branchId: 1,
        outOfStock: 0,
      },
    );

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

    // mock getRepository(BranchInactiveProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(branchInactiveProduct),
          delete: jest.fn().mockRejectedValue(errorTest),
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
      await service.updateStatusAndRecommend(product.id, params);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(503001);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BRANCH_INACTIVE_PRODUCT_DELETE_ERROR',
      );
    }
  });

  it('should throw exception if inactive product error', async () => {
    const params: UpdateStatusParamsInterface = {
      branchId: 1,
      isActive: 0,
      isOutOfStock: 0,
    };

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
          findOne: jest.fn().mockResolvedValue(product),
        };
      });

    // mock getRepository(BranchInactiveProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(null),
          save: jest.fn().mockRejectedValue(errorTest),
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
      await service.updateStatusAndRecommend(product.id, params);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(503002);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BRANCH_INACTIVE_PRODUCT_CREATE_ERROR',
      );
    }
  });

  it('should throw exception if update out of stock error', async () => {
    const params: UpdateStatusParamsInterface = {
      branchId: 1,
      isActive: 0,
      isOutOfStock: 0,
    };

    const product: ProductEntity = plainToInstance(ProductEntity, {
      id: 1,
      title: '{"en":"product title"}',
      isActive: 1,
    });

    const branchInactiveProduct: BranchInactiveProductEntity = plainToInstance(
      BranchInactiveProductEntity,
      {
        id: 1,
        productId: product.id,
        branchId: params.branchId,
        outOfStock: 1,
      },
    );

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

    // mock getRepository(BranchInactiveProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(branchInactiveProduct),
          update: jest.fn().mockRejectedValue(errorTest),
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
      await service.updateStatusAndRecommend(1, params);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(503003);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BRANCH_INACTIVE_PRODUCT_UPDATE_ERROR',
      );
    }
  });

  it('should throw exception if recommend product error', async () => {
    const params: UpdateStatusParamsInterface = {
      branchId: 1,
      isActive: 1,
      isOutOfStock: 0,
      isRecommend: 1,
    };

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
          findOne: jest.fn().mockResolvedValue(product),
        };
      });

    // mock getRepository(BranchInactiveProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(null),
        };
      });

    // mock getRepository(BranchRecommendProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(null),
          save: jest.fn().mockRejectedValue(errorTest),
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
      await service.updateStatusAndRecommend(1, params);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(504002);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BRANCH_RECOMMEND_PRODUCT_CREATE_ERROR',
      );
    }
  });

  it('should throw exception if not recommend product error', async () => {
    const params: UpdateStatusParamsInterface = {
      branchId: 1,
      isActive: 1,
      isOutOfStock: 0,
      isRecommend: 0,
    };

    const product: ProductEntity = plainToInstance(ProductEntity, {
      id: 1,
      title: '{"en":"product title"}',
      isActive: 1,
    });

    const branchRecommendProduct: BranchRecommendProductEntity =
      plainToInstance(BranchRecommendProductEntity, {
        id: 1,
        productId: product.id,
        branchId: params.branchId,
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

    // mock getRepository(BranchInactiveProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(null),
        };
      });

    // mock getRepository(BranchRecommendProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(branchRecommendProduct),
          delete: jest.fn().mockRejectedValue(errorTest),
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
      await service.updateStatusAndRecommend(1, params);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(504001);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BRANCH_RECOMMEND_PRODUCT_DELETE_ERROR',
      );
    }
  });

  it('should throw exception if product not found', async () => {
    const params: UpdateStatusParamsInterface = {
      branchId: 1,
      isActive: 1,
      isOutOfStock: 1,
    };

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

    service = module.get<BranchProductService>(BranchProductService);

    try {
      await service.updateStatusAndRecommend(1, params);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(800001);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'PRODUCT_NOT_FOUND',
      );
    }
  });
});
