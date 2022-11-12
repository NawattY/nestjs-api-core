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
import { UploadFile } from '@helpers/upload-file.helper';
import { CACHE_MANAGER } from '@nestjs/common';
import { CreateThumbnailProvider } from '@providers/filesystems/s3/create-thumbnail.provider';
import { S3Service } from '@appotter/nestjs-s3';

describe('MerchantServiceDestrory', () => {
  let merchantRepository: Repository<MerchantEntity>;
  let service: MerchantService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
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

  it('should return ok.', async () => {
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

    const deleteMerchant: UpdateResult = {
      generatedMaps: [],
      raw: [
        {
          id: 1,
          title: 'test',
          description: 'test',
          settings: JSON.parse('{ "test": "test" }'),
          domain: 'test',
          isActive: 1,
          createdAt: merchantEntity.createdAt,
          updatedAt: merchantEntity.updatedAt,
          deletedAt: new Date(),
        },
      ],
      affected: 1,
    };

    jest.spyOn(merchantRepository, 'findOne').mockResolvedValue(merchantEntity);
    jest
      .spyOn(merchantRepository, 'softDelete')
      .mockResolvedValue(deleteMerchant);

    const result = await service.destroy(1);

    // return void
    expect(result).toBeUndefined();
  });

  it('should be return error not found.', async () => {
    jest.spyOn(merchantRepository, 'findOne').mockResolvedValue(null);

    try {
      await service.destroy(1);
    } catch (error: any) {
      expect(error.response.errorCode).toEqual(200001);
      expect(error.response.errorMessage).toEqual('MERCHANT_NOT_FOUND');
    }
  });

  it('should be return error.', async () => {
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
    jest
      .spyOn(merchantRepository, 'softDelete')
      .mockRejectedValue(new Error('error'));

    try {
      await service.destroy(1);
    } catch (error: any) {
      expect(error.response.errorCode).toEqual(200005);
      expect(error.response.errorMessage).toEqual('MERCHANT_DELETE_ERROR');
    }
  });
});
