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

describe('ProductService -> store', () => {
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
  let fakeUploadFile: Partial<UploadFile>;

  beforeEach(async () => {
    fakeMerchantConnection = {
      getRepository: jest.fn(),
    };
    fakeS3Service = {
      delete: jest.fn(),
    };
    fakeUploadFile = {
      uploadImage: jest.fn(),
    };
  });

  it('should be ok', async () => {
    const params = {
      categoryId: 1,
      title: '{"en":"product"}',
      detail: '{"en":"detail"}',
      specialPrice: null,
      normalPrice: 100,
      ordinal: 1,
      isActive: 1,
      image: plainToInstance(MemoryStoredFile, {
        originalName: 'name.jpeg',
        mimetype: 'image/jpeg',
        size: 10000,
        buffer: Buffer.alloc(10000),
      }),
    };
    const category: CategoryEntity = plainToInstance(CategoryEntity, {
      id: 1,
      title: '{"en":"category title"}',
      isActive: 1,
    });
    const product: ProductEntity = plainToInstance(ProductEntity, {
      title: params.title,
      detail: params.detail,
      isActive: params.isActive,
      categoryId: params.categoryId,
      normalPrice: params.normalPrice,
      specialPrice: params.specialPrice,
      image: params.image,
    });

    // mock getRepository(ProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
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
          useValue: fakeUploadFile,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);

    jest.spyOn(fakeUploadFile, 'uploadImage').mockResolvedValue('product.png');

    const result = await service.store(params);

    expect(result.title).toEqual(product.title);
  });

  it('should throw exception if product category not found', async () => {
    // mock getRepository(CategoryEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementation(() => {
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
          useValue: fakeUploadFile,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);

    try {
      await service.store({});
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(600002);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'CATEGORY_NOT_FOUND',
      );
    }
  });

  it('should throw exception if create error', async () => {
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
          useValue: fakeUploadFile,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);

    const params = {
      categoryId: 1,
      title: '{"en":"product"}',
      detail: '{"en":"detail"}',
      specialPrice: null,
      normalPrice: 100,
      ordinal: 1,
      isActive: 1,
      image: plainToInstance(MemoryStoredFile, {
        originalName: 'name.jpeg',
        mimetype: 'image/jpeg',
        size: 10000,
        buffer: Buffer.alloc(10000),
      }),
    };

    jest.spyOn(fakeUploadFile, 'uploadImage').mockResolvedValue('product.png');

    try {
      await service.store(params);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(800004);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'PRODUCT_CREATE_ERROR',
      );
    }
  });
});
