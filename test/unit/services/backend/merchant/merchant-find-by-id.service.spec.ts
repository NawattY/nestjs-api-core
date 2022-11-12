import { S3Service } from '@appotter/nestjs-s3';
import { MerchantConnectionEntity } from '@entities/default/merchant-connections.entity';
import { MerchantEntity } from '@entities/default/merchant.entity';
import { UserEntity } from '@entities/default/user.entity';
import { UploadFile } from '@helpers/upload-file.helper';
import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateThumbnailProvider } from '@providers/filesystems/s3/create-thumbnail.provider';
import { MerchantService } from '@services/backend/admin/merchant.service';
import { plainToInstance } from 'class-transformer';
import { TenantsService } from 'src/app/tenancy/tenancy.service';
import { Connection, Repository } from 'typeorm';

describe('MerchantServiceFindById', () => {
  let merchantRepository: Repository<MerchantEntity>;
  let service: MerchantService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MerchantService,
        TenantsService,
        ConfigService,
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
          useValue: {},
        },
      ],
    }).compile();

    service = await module.resolve<MerchantService>(MerchantService);
    merchantRepository = module.get<Repository<MerchantEntity>>(
      getRepositoryToken(MerchantEntity),
    );
  });

  it('should return the merchant', async () => {
    const merchantEntity = plainToInstance(MerchantEntity, {
      id: 1,
      title: 'test',
      description: 'test',
      settings: JSON.parse('{ "test": "test" }'),
      domain: 'test',
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    jest.spyOn(merchantRepository, 'findOne').mockResolvedValue(merchantEntity);

    const result = await service.findById(1);

    expect(result).toEqual(merchantEntity);
  });

  it('should be return error.', async () => {
    jest.spyOn(merchantRepository, 'findOne').mockResolvedValue(undefined);

    try {
      await service.findById(1);
    } catch (error: any) {
      expect(error.response.errorCode).toEqual(200001);
      expect(error.response.errorMessage).toEqual('MERCHANT_NOT_FOUND');
    }
  });
});
