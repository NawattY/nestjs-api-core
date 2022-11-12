import { MerchantConnectionEntity } from '@entities/default/merchant-connections.entity';
import { MerchantEntity } from '@entities/default/merchant.entity';
import { UserEntity } from '@entities/default/user.entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MerchantService } from '@services/backend/admin/merchant.service';
import { TenantsService } from 'src/app/tenancy/tenancy.service';
import { Connection, Repository, UpdateResult } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { S3Service } from '@appotter/nestjs-s3';
import { CreateThumbnailProvider } from '@providers/filesystems/s3/create-thumbnail.provider';
import { UploadFile } from '@helpers/upload-file.helper';
import { CACHE_MANAGER } from '@nestjs/common';
import { UpdateTemplateDto } from '@dtos/v1/backend/admin/merchant/update-template.dto';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { MemoryStoredFile } from 'nestjs-form-data';
import { S3ProviderModule } from '@providers/filesystems/s3/provider.module';

describe('MerchantServiceUpdateTemplate', () => {
  let merchantRepository: Repository<MerchantEntity>;
  let service: MerchantService;
  let fakeRequest: Partial<Request>;
  let fakeS3Service: Partial<S3Service>;
  let uploadFile: Partial<UploadFile>;
  let createThumbnailProvider: Partial<CreateThumbnailProvider>;

  const dto = {
    primaryColor: '#000000',
    secondaryColor: '#000000',
    textOnPrimaryColor: '#000000',
    backgroundColor: '#000000',
  } as UpdateTemplateDto;

  beforeEach(async () => {
    fakeS3Service = {
      putAsUniqueName: jest.fn(),
      delete: jest.fn(),
      put: jest.fn(),
    };
    uploadFile = {
      uploadImage: jest.fn(),
    };
    fakeRequest = {
      merchantId: 1,
    };
    createThumbnailProvider = {
      create: jest.fn(),
    };
  });

  it('should return ok. upload image', async () => {
    const module = await Test.createTestingModule({
      imports: [S3ProviderModule],
      providers: [
        ConfigService,
        MerchantService,
        TenantsService,
        {
          provide: getRepositoryToken(MerchantEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MerchantConnectionEntity),
          useClass: Repository,
        },
        {
          provide: Connection,
          useFactory: () => jest.fn(),
        },
        {
          provide: UploadFile,
          useValue: { uploadImage: jest.fn() },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
        {
          provide: REQUEST,
          useValue: fakeRequest,
        },
        {
          provide: CreateThumbnailProvider,
          useValue: createThumbnailProvider,
        },
        {
          provide: S3Service,
          useValue: fakeS3Service,
        },
      ],
    }).compile();

    service = await module.resolve<MerchantService>(MerchantService);
    merchantRepository = module.get<Repository<MerchantEntity>>(
      getRepositoryToken(MerchantEntity),
    );
    fakeRequest = module.get<Request>(REQUEST);
    fakeS3Service = module.get<S3Service>(S3Service);
    const mockMerchant = plainToInstance(MerchantEntity, {
      id: 1,
      title: 'test',
      description: 'test',
      settings: JSON.parse(
        '{"locale":"th","logoImage":"merchant/images/image.png","primaryColor":"#0373ab","textOnPrimaryColor":"#ffffff","backgroundColor":"#13e975","secondaryColor":"#365c50","highlightTextColor":"","supportLocales":["th","en"]}',
      ),
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const updateResult = plainToInstance(UpdateResult, {
      affected: 1,
    });

    jest
      .spyOn(merchantRepository, 'findOne')
      .mockResolvedValueOnce(mockMerchant);
    jest.spyOn(merchantRepository, 'update').mockResolvedValue(updateResult);

    jest.spyOn(uploadFile, 'uploadImage').mockResolvedValue(`logo/image.jpg`);
    jest.spyOn(fakeS3Service, 'putAsUniqueName').mockResolvedValueOnce({
      url: 'https://s3.com/merchant/images/name.jpeg',
      origin: {
        Location: 'https://s3.com/merchant/images/name.jpeg',
        ETag: 'test',
        Bucket: 'test',
        Key: 'test',
      },
    });
    jest.spyOn(fakeS3Service, 'put').mockReturnThis();
    jest
      .spyOn(merchantRepository, 'findOne')
      .mockResolvedValueOnce(mockMerchant);
    const result = await service.updateTemplate({
      ...dto,
      logoImage: null,
      //   logoImage: plainToInstance(MemoryStoredFile, {
      //     originalName: 'name.jpeg',
      //     mimetype: 'image/jpeg',
      //     size: 10000,
      //     buffer: Buffer.alloc(10000),
      //     encoding: 'binary',
      //   }),
    });
    expect(result).toEqual(mockMerchant);
  });

  it('should return ok.', async () => {
    const module = await Test.createTestingModule({
      imports: [S3ProviderModule],
      providers: [
        ConfigService,
        MerchantService,
        TenantsService,
        {
          provide: getRepositoryToken(MerchantEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MerchantConnectionEntity),
          useClass: Repository,
        },
        {
          provide: Connection,
          useFactory: () => jest.fn(),
        },
        {
          provide: UploadFile,
          useValue: { uploadImage: jest.fn() },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
        {
          provide: REQUEST,
          useValue: fakeRequest,
        },
        {
          provide: CreateThumbnailProvider,
          useValue: createThumbnailProvider,
        },
        {
          provide: S3Service,
          useValue: fakeS3Service,
        },
      ],
    }).compile();

    service = await module.resolve<MerchantService>(MerchantService);
    merchantRepository = module.get<Repository<MerchantEntity>>(
      getRepositoryToken(MerchantEntity),
    );
    fakeRequest = module.get<Request>(REQUEST);
    fakeS3Service = module.get<S3Service>(S3Service);
    const mockMerchant = plainToInstance(MerchantEntity, {
      id: 1,
      title: 'test',
      description: 'test',
      settings: JSON.parse(
        '{"locale":"th","logoImage":"merchant/images/image.png","primaryColor":"#0373ab","textOnPrimaryColor":"#ffffff","backgroundColor":"#13e975","secondaryColor":"#365c50","highlightTextColor":"","supportLocales":["th","en"]}',
      ),
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const updateResult = plainToInstance(UpdateResult, {
      affected: 1,
    });

    jest
      .spyOn(merchantRepository, 'findOne')
      .mockResolvedValueOnce(mockMerchant);
    jest.spyOn(uploadFile, 'uploadImage').mockResolvedValue(`logo/image.jpg`);
    jest.spyOn(fakeS3Service, 'putAsUniqueName').mockResolvedValue({
      url: 'https://s3.com/merchant/images/name.jpeg',
      origin: {
        Location: 'https://s3.com/merchant/images/name.jpeg',
        ETag: 'test',
        Bucket: 'test',
        Key: 'https://s3.com/merchant/images/name.jpeg',
      },
    });
    jest.spyOn(fakeS3Service, 'put').mockReturnThis();
    jest.spyOn(merchantRepository, 'update').mockResolvedValue(updateResult);
    jest
      .spyOn(merchantRepository, 'findOne')
      .mockResolvedValueOnce(mockMerchant);

    const result = await service.updateTemplate({
      ...dto,
      logoImage: plainToInstance(MemoryStoredFile, {
        originalName: 'test.jpeg',
        mimetype: 'image/jpeg',
        size: 500,
        buffer: Buffer.alloc(500),
      }),
    });
    expect(result).toEqual(mockMerchant);
  });

  it('should be return update template error.', async () => {
    const module = await Test.createTestingModule({
      imports: [S3ProviderModule],
      providers: [
        ConfigService,
        MerchantService,
        TenantsService,
        {
          provide: getRepositoryToken(MerchantEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MerchantConnectionEntity),
          useClass: Repository,
        },
        {
          provide: Connection,
          useFactory: () => jest.fn(),
        },
        {
          provide: S3Service,
          useValue: fakeS3Service,
        },
        {
          provide: UploadFile,
          useValue: { uploadImage: jest.fn() },
        },
        {
          provide: CreateThumbnailProvider,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
        {
          provide: REQUEST,
          useValue: fakeRequest,
        },
      ],
    }).compile();

    service = await module.resolve<MerchantService>(MerchantService);
    merchantRepository = module.get<Repository<MerchantEntity>>(
      getRepositoryToken(MerchantEntity),
    );
    fakeRequest = module.get<Request>(REQUEST);
    fakeS3Service = module.get<S3Service>(S3Service);
    const mockMerchant = plainToInstance(MerchantEntity, {
      id: 1,
      title: 'test',
      description: 'test',
      settings: JSON.parse(
        '{"locale":"th","logoImage":"merchant/images/image.png","primaryColor":"#0373ab","textOnPrimaryColor":"#ffffff","backgroundColor":"#13e975","secondaryColor":"#365c50","highlightTextColor":"","supportLocales":["th","en"]}',
      ),
      domain: 'test',
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    jest
      .spyOn(merchantRepository, 'findOne')
      .mockResolvedValueOnce(mockMerchant);
    jest
      .spyOn(merchantRepository, 'save')
      .mockRejectedValue(new Error('error'));
    jest.spyOn(fakeS3Service, 'putAsUniqueName').mockResolvedValue({
      url: 'https://s3.com/merchant/images/name.jpeg',
      origin: {
        Location: 'https://s3.com/merchant/images/name.jpeg',
        ETag: 'test',
        Bucket: 'test',
        Key: 'test',
      },
    });

    try {
      await service.updateTemplate(dto);
    } catch (error: any) {
      expect(error.response.errorCode).toEqual(200011);
      expect(error.response.errorMessage).toEqual(
        'MERCHANT_UPDATE_TEMPLATE_ERROR',
      );
    }
  });

  it('should be return upload error.', async () => {
    const module = await Test.createTestingModule({
      imports: [S3ProviderModule],
      providers: [
        ConfigService,
        MerchantService,
        TenantsService,
        {
          provide: getRepositoryToken(MerchantEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MerchantConnectionEntity),
          useClass: Repository,
        },
        {
          provide: Connection,
          useFactory: () => jest.fn(),
        },
        {
          provide: S3Service,
          useValue: fakeS3Service,
        },
        {
          provide: UploadFile,
          useValue: {},
        },
        {
          provide: CreateThumbnailProvider,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
        {
          provide: REQUEST,
          useValue: fakeRequest,
        },
      ],
    }).compile();

    service = await module.resolve<MerchantService>(MerchantService);
    merchantRepository = module.get<Repository<MerchantEntity>>(
      getRepositoryToken(MerchantEntity),
    );
    fakeRequest = module.get<Request>(REQUEST);
    fakeS3Service = module.get<S3Service>(S3Service);

    const mockMerchant = plainToInstance(MerchantEntity, {
      id: 1,
      title: 'test',
      description: 'test',
      settings: JSON.parse(
        '{"locale":"th","logoImage":"merchant/images/image.png","primaryColor":"#0373ab","textOnPrimaryColor":"#ffffff","backgroundColor":"#13e975","secondaryColor":"#365c50","highlightTextColor":"","supportLocales":["th","en"]}',
      ),
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const mockS3DeleteResponse = {
      status: true,
      origin: {},
    };

    const updateResult = plainToInstance(UpdateResult, {
      affected: 1,
    });
    jest
      .spyOn(fakeS3Service, 'delete')
      .mockResolvedValueOnce(mockS3DeleteResponse);
    jest
      .spyOn(merchantRepository, 'findOne')
      .mockResolvedValueOnce(mockMerchant);
    jest.spyOn(fakeS3Service, 'putAsUniqueName').mockResolvedValue({
      url: 'https://s3.com/merchant/images/name.jpeg',
      origin: {
        Location: 'https://s3.com/merchant/images/name.jpeg',
        ETag: 'test',
        Bucket: 'test',
        Key: 'test',
      },
    });
    jest.spyOn(merchantRepository, 'update').mockResolvedValue(updateResult);
    jest
      .spyOn(merchantRepository, 'findOne')
      .mockResolvedValueOnce(mockMerchant);
    jest.spyOn(uploadFile, 'uploadImage').mockRejectedValue(new Error('error'));

    try {
      await service.updateTemplate({
        ...dto,
        logoImage: plainToInstance(MemoryStoredFile, {
          originalName: 'name.jpeg',
          mimetype: 'image/jpeg',
          size: 10000,
          buffer: Buffer.alloc(10000),
        }),
      });
    } catch (error) {
      expect(error.response.errorCode).toEqual(400001);
      expect(error.response.errorMessage).toEqual('UPLOAD_IMAGE_ERROR');
    }
  });
});
