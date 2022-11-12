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
import { MerchantStoreDto } from '@dtos/v1/backend/admin/merchant/merchant-store.dto';

describe('MerchantServiceUpdateStatus', () => {
  let merchantRepository: Repository<MerchantEntity>;
  let userRepository: Repository<UserEntity>;
  let merchantConnectionRepository: Repository<MerchantConnectionEntity>;
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
    merchantConnectionRepository = module.get<
      Repository<MerchantConnectionEntity>
    >(getRepositoryToken(MerchantConnectionEntity));
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should return ok.', async () => {
    const mockDto = plainToInstance(MerchantStoreDto, {
      email: 'test@example.com',
      name: 'test',
    });
    plainToInstance(UserEntity, {
      id: 1,
      email: 'test@example.com',
      name: 'test',
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
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

    const updateResult = plainToInstance(UpdateResult, {
      generatedMaps: [],
      raw: [],
      affected: 1,
    });

    jest.spyOn(merchantRepository, 'delete').mockResolvedValue(updateResult);
    jest
      .spyOn(merchantConnectionRepository, 'update')
      .mockResolvedValue(updateResult);
    jest.spyOn(userRepository, 'delete').mockResolvedValue(updateResult);

    const result = await service.removeSetupMerchantUpdate(
      mockDto,
      merchantEntity.id,
    );
    expect(result).toBeUndefined();
  });

  it('should return ok.', async () => {
    const mockDto = plainToInstance(MerchantStoreDto, {
      email: 'test@example.com',
      name: 'test',
      title: 'test',
      domain: 'example.com',
    });
    plainToInstance(UserEntity, {
      id: 1,
      email: 'test@example.com',
      name: 'test',
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
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

    const updateResult = plainToInstance(UpdateResult, {
      generatedMaps: [],
      raw: [],
      affected: 1,
    });

    jest.spyOn(merchantRepository, 'delete').mockResolvedValue(updateResult);
    jest
      .spyOn(merchantConnectionRepository, 'update')
      .mockResolvedValue(updateResult);
    jest.spyOn(userRepository, 'delete').mockResolvedValue(updateResult);

    const result = await service.removeSetupMerchant(
      mockDto,
      merchantEntity.id,
    );
    expect(result).toBeUndefined();
  });
});
