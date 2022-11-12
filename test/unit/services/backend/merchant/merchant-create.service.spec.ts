import { S3Service } from '@appotter/nestjs-s3';
import { MerchantConnectionEntity } from '@entities/default/merchant-connections.entity';
import { MerchantEntity } from '@entities/default/merchant.entity';
import { UserEntity } from '@entities/default/user.entity';
import { UserType } from '@enums/user-type';
import { UploadFile } from '@helpers/upload-file.helper';
import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateThumbnailProvider } from '@providers/filesystems/s3/create-thumbnail.provider';
import { MerchantService } from '@services/backend/admin/merchant.service';
import { plainToInstance } from 'class-transformer';
import { TenantsService } from 'src/app/tenancy/tenancy.service';
import { Connection, Repository, EntityManager } from 'typeorm';
import { PATH_MERCHANT_IMAGE } from '@constants/path-upload';
import { MemoryStoredFile } from 'nestjs-form-data';

describe('MerchantServiceCreate', () => {
  let merchantRepository: Repository<MerchantEntity>;
  let userRepository: Repository<UserEntity>;
  let service: MerchantService;
  let uploadFile: Partial<UploadFile>;

  beforeEach(async () => {
    uploadFile = {
      uploadImage: jest.fn(),
    };

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
          useValue: {
            createQueryRunner: jest.fn(() => ({
              connect: jest.fn().mockReturnThis(),
              release: jest.fn().mockReturnThis(),
              startTransaction: jest.fn().mockReturnThis(),
              commitTransaction: jest.fn().mockReturnThis(),
              rollbackTransaction: jest.fn().mockReturnThis(),
              save: jest.fn().mockReturnThis(),
              findOne: jest.fn().mockReturnThis(),
            })),
          },
        },
        {
          provide: S3Service,
          useValue: {
            putAsUniqueName: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: CreateThumbnailProvider,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: UploadFile,
          useValue: { uploadImage: jest.fn() },
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
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be ok ', async () => {
    jest.spyOn(merchantRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    jest
      .spyOn(uploadFile, 'uploadImage')
      .mockResolvedValue(`${PATH_MERCHANT_IMAGE}image.jpg`);

    try {
      await service.store({
        title: 'null',
        domain: 'example.com',
        email: 'bbb@test.com',
        name: 'null',
        password: '123Aaa',
        connectionId: 1,
        mobile: '',
        description: '',
      });
    } catch (error) {}
  });

  it('merchant domain duplicate', async () => {
    const mockMerchant = plainToInstance(MerchantEntity, {
      id: 10,
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const mockUser = plainToInstance(UserEntity, {
      id: 10,
      fullName: 'test',
      email: 'test@merchant.com',
      password: '$2a$12$CTkW7tuQC4cBn262QB1dcOVCnZaNqT3V230hZ7yYJ/Stg9oKafOsK',
      profileImage: plainToInstance(MemoryStoredFile, {
        originalName: 'name.jpeg',
        mimetype: 'image/jpeg',
        size: 10000,
        buffer: Buffer.alloc(10000),
      }),
      mobile: '',
      type: UserType.MERCHANT,
      merchantId: mockMerchant.id,
      isActive: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    jest.spyOn(merchantRepository, 'findOne').mockResolvedValue(mockMerchant);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    jest
      .spyOn(uploadFile, 'uploadImage')
      .mockResolvedValue(`${PATH_MERCHANT_IMAGE}image.jpg`);

    try {
      await service.store({
        title: 'null',
        domain: 'null',
        email: 'test@test.com',
        name: 'null',
        password: '123Aaa',
        connectionId: 1,
        mobile: '',
        description: '',
      });
    } catch (error) {
      expect(error.response.errorMessage).toEqual('MERCHANT_DOMAIN_DUPLICATE');
      expect(error.response.errorCode).toEqual(200006);
    }
  });

  it('email already exist', async () => {
    const mockUser = plainToInstance(UserEntity, {
      id: 10,
      fullName: 'test',
      email: 'test@test.com',
      password: '$2a$12$CTkW7tuQC4cBn262QB1dcOVCnZaNqT3V230hZ7yYJ/Stg9oKafOsK',
      profileImage: plainToInstance(MemoryStoredFile, {
        originalName: 'name.jpeg',
        mimetype: 'image/jpeg',
        size: 10000,
        buffer: Buffer.alloc(10000),
      }),
      mobile: '',
      type: UserType.MERCHANT,
      merchantId: 1,
      isActive: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    jest.spyOn(merchantRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    jest
      .spyOn(uploadFile, 'uploadImage')
      .mockResolvedValue(`${PATH_MERCHANT_IMAGE}image.jpg`);

    try {
      await service.store({
        title: 'null',
        domain: 'null',
        email: 'test@test.com',
        name: 'null',
        password: '123Aaa',
        connectionId: 1,
        mobile: '',
        description: '',
      });
    } catch (error) {
      expect(error.response.errorMessage).toEqual(
        'MERCHANT_CREATE_EMAIL_ALREADY_EXIST',
      );
      expect(error.response.errorCode).toEqual(200003);
    }
  });
});
