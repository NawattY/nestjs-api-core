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

describe('Backend -> CategoryService -> findById', () => {
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
      isActive: 1,
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
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockReturnValue(mockCategory),
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

    const result = await service.findById(mockCategory.id, {
      appends: 'productCount',
    });

    expect(result.id).toEqual(mockCategory.id);
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
      await service.findById(1);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(600002);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'CATEGORY_NOT_FOUND',
      );
    }
  });
});
