import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { AppConfigService } from 'src/config/app/config.service';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { get } from 'lodash';
import { ProductEntity } from '@entities/tenant/products.entity';
import { S3Service } from '@appotter/nestjs-s3';
import { UploadFile } from '@helpers/upload-file.helper';
import { ProductService } from '@services/backend/merchant/product.service';
import { CategoryEntity } from '@entities/tenant/categories.entity';
import { MemoryStoredFile } from 'nestjs-form-data';

describe('ProductService -> update', () => {
  const errorTest = new Error('error');
  const sharedTestProviders = [
    ProductService,
    {
      provide: AppConfigService,
      useValue: {},
    },
  ];

  let service: ProductService;
  let fakeMerchantConnection: Partial<Connection>;
  let fakeS3Service: Partial<S3Service>;
  let uploadFile: Partial<UploadFile>;

  beforeEach(async () => {
    fakeMerchantConnection = {
      getRepository: jest.fn(),
    };
    fakeS3Service = {
      delete: jest.fn(),
    };
    uploadFile = {
      uploadImage: jest.fn(),
    };
  });

  it('should be ok', async () => {
    const category: CategoryEntity = plainToInstance(CategoryEntity, {
      id: 1,
      title: '{"en":"category title"}',
      isActive: 1,
    });

    const product: ProductEntity = plainToInstance(ProductEntity, {
      id: 1,
      title: '{"en":"product title"}',
      isActive: 1,
      categoryId: category.id,
      image: 'product.jpg',
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
          save: jest.fn().mockResolvedValue(product),
        };
      });

    // mock getRepository(CategoryEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(category),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        ...sharedTestProviders,
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
        {
          provide: S3Service,
          useValue: fakeS3Service,
        },
        {
          provide: UploadFile,
          useValue: uploadFile,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    fakeS3Service = module.get<S3Service>(S3Service);

    const params = {
      categoryId: category.id,
      image: '',
    };

    const mockS3DeleteResponse = {
      status: true,
      origin: {},
    };

    jest.spyOn(fakeS3Service, 'delete').mockResolvedValue(mockS3DeleteResponse);

    const result = await service.update(product.id, params);

    expect(result.id).toEqual(product.id);
  });

  it('should be ok if upload image', async () => {
    const category: CategoryEntity = plainToInstance(CategoryEntity, {
      id: 1,
      title: '{"en":"category title"}',
      isActive: 1,
    });

    const product: ProductEntity = plainToInstance(ProductEntity, {
      id: 1,
      title: '{"en":"product title"}',
      isActive: 1,
      categoryId: category.id,
      image: 'product.jpg',
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
          save: jest.fn().mockResolvedValue(product),
        };
      });

    // mock getRepository(CategoryEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(category),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        ...sharedTestProviders,
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
        {
          provide: S3Service,
          useValue: fakeS3Service,
        },
        {
          provide: UploadFile,
          useValue: uploadFile,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    fakeS3Service = module.get<S3Service>(S3Service);

    const params = {
      categoryId: category.id,
      image: plainToInstance(MemoryStoredFile, {
        originalName: 'name.jpeg',
        mimetype: 'image/jpeg',
        size: 10000,
        buffer: Buffer.alloc(10000),
      }),
    };

    jest.spyOn(uploadFile, 'uploadImage').mockResolvedValue('name.jpeg');

    const result = await service.update(product.id, params);

    expect(result.id).toEqual(product.id);
  });

  it('should throw exception if product category not found', async () => {
    // mock getRepository(ProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
        };
      });

    // mock getRepository(CategoryEntity)
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
        {
          provide: S3Service,
          useValue: fakeS3Service,
        },
        {
          provide: UploadFile,
          useValue: uploadFile,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);

    try {
      await service.update(1, {});
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(600002);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'CATEGORY_NOT_FOUND',
      );
    }
  });

  it('should throw exception if product not found', async () => {
    const category: CategoryEntity = plainToInstance(CategoryEntity, {
      id: 1,
      title: '{"en":"category title"}',
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
            getOne: jest.fn().mockResolvedValue(null),
          })),
        };
      });

    // mock getRepository(CategoryEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(category),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        ...sharedTestProviders,
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
        {
          provide: S3Service,
          useValue: fakeS3Service,
        },
        {
          provide: UploadFile,
          useValue: uploadFile,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);

    try {
      await service.update(1, {});
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(800001);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'PRODUCT_NOT_FOUND',
      );
    }
  });

  it('should throw exception if update error', async () => {
    const category: CategoryEntity = plainToInstance(CategoryEntity, {
      id: 1,
      title: '{"en":"category title"}',
      isActive: 1,
    });

    const product: ProductEntity = plainToInstance(ProductEntity, {
      id: 1,
      title: '{"en":"product title"}',
      isActive: 1,
      categoryId: category.id,
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
          save: jest.fn().mockRejectedValue(errorTest),
        };
      });

    // mock getRepository(CategoryEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(category),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        ...sharedTestProviders,
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
        {
          provide: S3Service,
          useValue: fakeS3Service,
        },
        {
          provide: UploadFile,
          useValue: uploadFile,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);

    try {
      await service.update(1, {});
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(800002);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'PRODUCT_UPDATE_ERROR',
      );
    }
  });
});
