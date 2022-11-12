import { S3Service } from '@appotter/nestjs-s3';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { UploadFile } from '@helpers/upload-file.helper';
import { Test } from '@nestjs/testing';
import { get } from 'lodash';
import { AppConfigService } from 'src/config/app/config.service';
import { Connection } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CategoryService } from '@services/backend/category.service';
import { CategoryEntity } from '@entities/tenant/categories.entity';
import { ProductEntity } from '@entities/tenant/products.entity';

describe('Backend -> CategoryService -> destroy', () => {
  const sharedTestProviders = [
    CategoryService,
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

  let service: CategoryService;
  let fakeMerchantConnection: Partial<Connection>;

  beforeEach(async () => {
    fakeMerchantConnection = {
      getRepository: jest.fn(),
    };
  });

  it('should be ok', async () => {
    const mockCategory: CategoryEntity = plainToInstance(CategoryEntity, {
      id: 1,
      title: '{"en":"test 1"}',
      ordinal: 1,
      isActive: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    // mock getRepository(CategoryService)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockReturnValue(mockCategory),
          })),
          softDelete: jest.fn(),
        };
      });

    // mock getRepository(ProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          find: jest.fn().mockResolvedValue(null),
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

    service = module.get<CategoryService>(CategoryService);

    const result = await service.destroy(mockCategory.id);
    expect(result).toBeUndefined();
  });

  it('should be soft delete error', async () => {
    const mockCategory: CategoryEntity = plainToInstance(CategoryEntity, {
      id: 1,
      title: '{"en":"test 1"}',
      ordinal: 1,
      isActive: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    // mock getRepository(CategoryService)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockReturnValue(mockCategory),
          })),
          softDelete: jest.fn().mockRejectedValue(new Error('error')),
        };
      });

    // mock getRepository(ProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          find: jest.fn().mockResolvedValue(null),
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

    service = module.get<CategoryService>(CategoryService);

    try {
      await service.destroy(mockCategory.id);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(600004);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'CATEGORY_DELETE_ERROR',
      );
    }
  });

  it('should throw exception if habe product not found', async () => {
    const mockCategory: CategoryEntity = plainToInstance(CategoryEntity, {
      id: 1,
      title: '{"en":"test 1"}',
      ordinal: 1,
      isActive: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const mockProduct: ProductEntity = plainToInstance(ProductEntity, {
      id: 1,
      categoryId: mockCategory.id,
    });

    // mock getRepository(CategoryService)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockReturnValue(mockCategory),
          })),
          softDelete: jest.fn(),
        };
      });

    // mock getRepository(ProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          find: jest.fn().mockResolvedValue(mockProduct),
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

    service = module.get<CategoryService>(CategoryService);

    try {
      await service.destroy(mockCategory.id);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(600005);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'CATEGORY_DELETE_ERROR_PRODUCT_AVAILABLE',
      );
    }
  });

  it('should throw exception if category not found', async () => {
    // mock getRepository(CategoryService)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockReturnValue(null),
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

    service = module.get<CategoryService>(CategoryService);

    try {
      await service.destroy(1);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(600002);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'CATEGORY_NOT_FOUND',
      );
    }
  });
});
