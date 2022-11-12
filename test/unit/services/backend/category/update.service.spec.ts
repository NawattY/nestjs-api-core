import { S3Service } from '@appotter/nestjs-s3';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { UploadFile } from '@helpers/upload-file.helper';
import { Test } from '@nestjs/testing';
import { AppConfigService } from 'src/config/app/config.service';
import { Connection, UpdateResult } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CategoryService } from '@services/backend/category.service';
import { CategoryEntity } from '@entities/tenant/categories.entity';
import { get } from 'lodash';

describe('Backend -> CategoryService -> update', () => {
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
    const parameters = {
      title: '{"th":"ใบไม้ขึ้นหัวแล้วนะ 2","en":"Test 2"}',
    };

    const mockCategory: CategoryEntity = plainToInstance(CategoryEntity, {
      id: 1,
      title: '{"th":"ใบไม้ขึ้นหัวแล้วนะ","en":"Test 1"}',
      ordinal: 1,
      isActive: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const resultCategory: CategoryEntity = plainToInstance(CategoryEntity, {
      id: 1,
      title: '{"th":"ใบไม้ขึ้นหัวแล้วนะ 2","en":"Test 2"}',
      ordinal: 1,
      isActive: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const updateResult = plainToInstance(UpdateResult, {
      generatedMaps: [],
      raw: resultCategory,
      affected: 1,
    });

    // mock getRepository(CategoryService)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValue(updateResult),
            getOne: jest.fn().mockReturnValue(resultCategory),
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

    const result = await service.update(mockCategory.id, parameters);
    expect(result).toEqual({ ...resultCategory, ...parameters });
  });

  it('should be update error', async () => {
    const parameters = {
      title: '{"th":"ใบไม้ขึ้นหัวแล้วนะ 2","en":"Test 2"}',
    };

    const mockCategory: CategoryEntity = plainToInstance(CategoryEntity, {
      id: 1,
      title: '{"th":"ใบไม้ขึ้นหัวแล้วนะ","en":"Test 1"}',
      ordinal: 1,
      isActive: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const resultCategory: CategoryEntity = plainToInstance(CategoryEntity, {
      id: 1,
      title: '{"th":"ใบไม้ขึ้นหัวแล้วนะ 2","en":"Test 2"}',
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
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            execute: jest.fn().mockRejectedValue(new Error('error')),
            getOne: jest.fn().mockReturnValue(resultCategory),
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
      await service.update(mockCategory.id, parameters);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(600003);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'CATEGORY_UPDATE_ERROR',
      );
    }
  });

  it('should throw exception if not affected error', async () => {
    const parameters = {
      title: '{"th":"ใบไม้ขึ้นหัวแล้วนะ","en":"Test 1"}',
    };

    const mockCategory: CategoryEntity = plainToInstance(CategoryEntity, {
      id: 1,
      title: '{"th":"ใบไม้ขึ้นหัวแล้วนะ","en":"Test 1"}',
      ordinal: 1,
      isActive: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const resultCategory: CategoryEntity = plainToInstance(CategoryEntity, {
      id: 1,
      title: '{"th":"ใบไม้ขึ้นหัวแล้วนะ","en":"Test 1"}',
      ordinal: 1,
      isActive: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const updateResult = plainToInstance(UpdateResult, {
      generatedMaps: [],
      raw: resultCategory,
      affected: 0,
    });

    // mock getRepository(CategoryService)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValue(updateResult),
            getOne: jest.fn().mockReturnValue(resultCategory),
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
      await service.update(mockCategory.id, parameters);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(600006);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'CATEGORY_UPDATE_ERROR_NOT_AFFECTED',
      );
    }
  });
});
