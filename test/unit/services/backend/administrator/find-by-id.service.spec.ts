import { Test, TestingModule } from '@nestjs/testing';
import { AdministratorService } from '@services/backend/admin/administrator.service';
import { S3ProviderModule } from '@providers/filesystems/s3/provider.module';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@entities/default/user.entity';
import { S3Service } from '@appotter/nestjs-s3';
import { CreateThumbnailProvider } from '@providers/filesystems/s3/create-thumbnail.provider';
import { plainToInstance } from 'class-transformer';
import { UserType } from '@enums/user-type';
import { Repository } from 'typeorm';
import { get } from 'lodash';

describe('AdministratorService -> findById', () => {
  let userRepository: Repository<UserEntity>;
  let administratorService: AdministratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [S3ProviderModule],
      providers: [
        AdministratorService,
        ConfigService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
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
      ],
    }).compile();

    administratorService =
      module.get<AdministratorService>(AdministratorService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(administratorService).toBeDefined();
  });

  it('should be ok', async () => {
    const userEntity: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      fullName: 'Elmer D. Adams',
      email: 'ElmerDAdams@jourrapide.com',
      password: '$2a$12$CTkW7tuQC4cBn262QB1dcOVCnZaNqT3V230hZ7yYJ/Stg9oKafOsK',
      mobile: '0899999999',
      type: UserType.ADMIN,
      profileImage: null,
      merchantId: 0,
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(userEntity);

    const result = await administratorService.findById(1);

    expect(result).toEqual(userEntity);
  });

  it('should throw exception if user not found', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    try {
      await administratorService.findById(1);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(100001);
      expect(get(err.getResponse(), 'errorMessage')).toEqual('USER_NOT_FOUND');
    }
  });
});
