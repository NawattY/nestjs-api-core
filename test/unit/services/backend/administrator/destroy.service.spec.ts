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
import { Repository, UpdateResult } from 'typeorm';
import { get } from 'lodash';

describe('AdministratorService -> destroy', () => {
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
          useClass: Repository,
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
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 2,
      fullName: 'Timothy J. Kenner',
      email: 'TimothyJKenner@rhyta.com',
      password: '$2a$12$CTkW7tuQC4cBn262QB1dcOVCnZaNqT3V230hZ7yYJ/Stg9oKafOsK',
      mobile: '0899999999',
      type: UserType.ADMIN,
      profileImage: null,
      merchantId: 0,
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

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
      deletedAt: null,
    });

    const deleteUser: UpdateResult = {
      generatedMaps: [],
      raw: [
        {
          id: 1,
          fullName: 'Elmer D. Adams',
          email: `${new Date()}_ElmerDAdams@jourrapide.com`,
          password:
            '$2a$12$CTkW7tuQC4cBn262QB1dcOVCnZaNqT3V230hZ7yYJ/Stg9oKafOsK',
          mobile: '0899999999',
          type: UserType.ADMIN,
          profileImage: null,
          merchantId: 0,
          isActive: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        },
      ],
      affected: 1,
    };

    const createQueryBuilder: any = {
      where: () => createQueryBuilder,
      update: () => createQueryBuilder,
      execute: () => createQueryBuilder,
    };

    jest
      .spyOn(userRepository, 'createQueryBuilder')
      .mockImplementation(() => createQueryBuilder);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(userEntity);
    jest.spyOn(userRepository, 'update').mockResolvedValue(deleteUser);

    const result = await administratorService.destroy(1, mockUser);

    expect(result).toBeUndefined();
  });

  it('should throw exception if delete yourself', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
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
      deletedAt: null,
    });

    try {
      await administratorService.destroy(1, mockUser);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(100005);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'CANNOT_DELETE_YOURSELF',
      );
    }
  });

  it('should throw exception if user not found', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
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
      deletedAt: null,
    });

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    try {
      await administratorService.destroy(2, mockUser);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(100001);
      expect(get(err.getResponse(), 'errorMessage')).toEqual('USER_NOT_FOUND');
    }
  });

  it('should throw exception if delete failed', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 2,
      fullName: 'Timothy J. Kenner',
      email: 'TimothyJKenner@rhyta.com',
      password: '$2a$12$CTkW7tuQC4cBn262QB1dcOVCnZaNqT3V230hZ7yYJ/Stg9oKafOsK',
      mobile: '0899999999',
      type: UserType.ADMIN,
      profileImage: null,
      merchantId: 0,
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

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
      deletedAt: null,
    });

    const deleteUser: UpdateResult = {
      generatedMaps: [],
      raw: [
        {
          id: 1,
          fullName: 'Elmer D. Adams',
          email: `${new Date()}_ElmerDAdams@jourrapide.com`,
          password:
            '$2a$12$CTkW7tuQC4cBn262QB1dcOVCnZaNqT3V230hZ7yYJ/Stg9oKafOsK',
          mobile: '0899999999',
          type: UserType.ADMIN,
          profileImage: null,
          merchantId: 0,
          isActive: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        },
      ],
      affected: 1,
    };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(userEntity);
    jest.spyOn(userRepository, 'update').mockResolvedValue(deleteUser);

    try {
      await administratorService.destroy(1, mockUser);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(100004);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'USER_DELETE_ERROR',
      );
    }
  });
});
