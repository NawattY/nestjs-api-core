import { MerchantConnectionEntity } from '@entities/default/merchant-connections.entity';
import { MerchantEntity } from '@entities/default/merchant.entity';
import { UserEntity } from '@entities/default/user.entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MerchantService } from '@services/backend/admin/merchant.service';
import { TenantsService } from 'src/app/tenancy/tenancy.service';
import { Connection, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { S3Service } from '@appotter/nestjs-s3';
import { CreateThumbnailProvider } from '@providers/filesystems/s3/create-thumbnail.provider';
import { UploadFile } from '@helpers/upload-file.helper';
import { CACHE_MANAGER } from '@nestjs/common';
import { MerchantStoreDto } from '@dtos/v1/backend/admin/merchant/merchant-store.dto';

describe('MerchantServiceUpdate', () => {
  let merchantRepository: Repository<MerchantEntity>;
  let service: MerchantService;
  const dto = {
    title: '{"en":"test 1"}',
    description: '{"en":"test 1"}',
    domain: 'example222.com',
    name: 'test',
    email: 'test@test.com',
    password: 'password',
    mobile: '0899999999',
    connectionId: 1,
  } as MerchantStoreDto;

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
    const mockMerchant = plainToInstance(MerchantEntity, {
      id: 10,
      domain: 'aaa',
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    jest.spyOn(merchantRepository, 'findOne').mockResolvedValueOnce(null);
    jest
      .spyOn(merchantRepository, 'findOne')
      .mockResolvedValueOnce(mockMerchant);
    jest.spyOn(merchantRepository, 'save').mockResolvedValue(mockMerchant);

    const result = await service.update(mockMerchant.id, dto);
    expect(result).toEqual(mockMerchant);
  });

  it('should be return error.', async () => {
    const mockMerchant = plainToInstance(MerchantEntity, {
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

    jest.spyOn(merchantRepository, 'findOne').mockResolvedValueOnce(null);
    jest
      .spyOn(merchantRepository, 'findOne')
      .mockResolvedValueOnce(mockMerchant);
    jest
      .spyOn(merchantRepository, 'save')
      .mockRejectedValue(new Error('error'));

    try {
      await service.update(1, dto);
    } catch (error: any) {
      expect(error.response.errorCode).toEqual(200004);
      expect(error.response.errorMessage).toEqual('MERCHANT_UPDATE_ERROR');
    }
  });
});
