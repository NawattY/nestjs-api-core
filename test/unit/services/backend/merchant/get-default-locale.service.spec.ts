import { S3Service } from '@appotter/nestjs-s3';
import { MerchantConnectionEntity } from '@entities/default/merchant-connections.entity';
import { MerchantEntity } from '@entities/default/merchant.entity';
import { UserEntity } from '@entities/default/user.entity';
import { UploadFile } from '@helpers/upload-file.helper';
import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateThumbnailProvider } from '@providers/filesystems/s3/create-thumbnail.provider';
import { MerchantService } from '@services/backend/admin/merchant.service';
import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { get } from 'lodash';
import { TenantsService } from 'src/app/tenancy/tenancy.service';
import { Connection, Repository } from 'typeorm';

describe('MerchantServiceUpdateLocale', () => {
  let merchantRepository: Repository<MerchantEntity>;
  let merchantService: MerchantService;
  let fakeCacheManager: Partial<Cache>;
  let fakeRequest: Partial<Request>;

  beforeEach(async () => {
    fakeCacheManager = {
      set: jest.fn(),
      get: jest.fn(),
    };

    fakeRequest = {
      merchantId: 1,
    };

    const module = await Test.createTestingModule({
      providers: [
        MerchantService,
        TenantsService,
        ConfigService,
        {
          provide: getRepositoryToken(MerchantEntity),
          useValue: {
            findOne: jest.fn(),
          },
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
          useValue: {},
        },
        {
          provide: S3Service,
          useValue: {},
        },
        {
          provide: CreateThumbnailProvider,
          useValue: {},
        },
        {
          provide: UploadFile,
          useValue: {},
        },
        {
          provide: CACHE_MANAGER,
          useValue: fakeCacheManager,
        },
        {
          provide: REQUEST,
          useValue: fakeRequest,
        },
      ],
    }).compile();

    merchantService = await module.resolve<MerchantService>(MerchantService);
    merchantRepository = module.get<Repository<MerchantEntity>>(
      getRepositoryToken(MerchantEntity),
    );
    fakeCacheManager = module.get<Cache>(CACHE_MANAGER);
    fakeRequest = module.get<Request>(REQUEST);
  });

  it('should be defined', () => {
    expect(merchantService).toBeDefined();
  });

  it('should be ok', async () => {
    const mockMerchant = plainToInstance(MerchantEntity, {
      id: fakeRequest.merchantId,
      title: 'test',
      description: 'test',
      settings: JSON.parse('{ "locale": "th" }'),
      domain: 'test',
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    jest.spyOn(merchantRepository, 'findOne').mockResolvedValue(mockMerchant);
    jest.spyOn(fakeCacheManager, 'set').mockReturnThis();

    const changed = await merchantService.getDefaultLocale(
      fakeRequest.merchantId,
    );

    expect(changed).toEqual('th');
  });

  it('should be fails if not has default locale', async () => {
    const mockMerchant = plainToInstance(MerchantEntity, {
      id: fakeRequest.merchantId,
      title: 'test',
      description: 'test',
      settings: JSON.parse('{ "test": "test" }'),
      domain: 'test',
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    jest.spyOn(merchantRepository, 'findOne').mockResolvedValue(mockMerchant);

    try {
      await merchantService.getDefaultLocale(fakeRequest.merchantId);
    } catch (error) {
      expect(get(error.getResponse(), 'errorCode')).toEqual(200007);
      expect(get(error.getResponse(), 'errorMessage')).toEqual(
        'MERCHANT_NOT_HAS_DEFAULT_LOCALE',
      );
    }
  });

  it('should be fails if merchant not found', async () => {
    jest.spyOn(merchantRepository, 'findOne').mockResolvedValue(null);

    try {
      await merchantService.getDefaultLocale(fakeRequest.merchantId);
    } catch (error) {
      expect(get(error.getResponse(), 'errorCode')).toEqual(200001);
      expect(get(error.getResponse(), 'errorMessage')).toEqual(
        'MERCHANT_NOT_FOUND',
      );
    }
  });
});
