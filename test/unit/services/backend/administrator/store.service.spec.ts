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
import { AdministratorStoreDto } from '@dtos/v1/backend/admin/administrator/administrator-store.dto';
import { MemoryStoredFile } from 'nestjs-form-data';
import { PATH_USER_IMAGE } from '@constants/path-upload';

const mockFileImage = {
  originalName: 'name.jpeg',
  mimetype: 'image/jpeg',
  size: 10000,
  buffer: Buffer.alloc(10000),
} as MemoryStoredFile;

const dto = {
  fullName: 'Elmer D. Adams',
  email: 'ElmerDAdams@jourrapide.com',
  password: '1234567890',
  passwordConfirm: '1234567890',
  mobile: '0899999999',
  type: UserType.ADMIN,
  profileImage: null,
  merchantId: 0,
  isActive: 3,
} as AdministratorStoreDto;

const dtoWithImage = {
  fullName: 'Elmer D. Adams',
  email: 'ElmerDAdams@jourrapide.com',
  password: '1234567890',
  passwordConfirm: '1234567890',
  mobile: '0899999999',
  type: UserType.ADMIN,
  profileImage: plainToInstance(MemoryStoredFile, mockFileImage),
  merchantId: 0,
  isActive: 3,
} as AdministratorStoreDto;

describe('AdministratorService -> store', () => {
  let fakeS3Service: Partial<S3Service>;
  let userRepository: Repository<UserEntity>;
  let administratorService: AdministratorService;

  fakeS3Service = {
    putAsUniqueName: jest.fn(),
    delete: jest.fn(),
  };

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
          useValue: fakeS3Service,
        },
        {
          provide: CreateThumbnailProvider,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    fakeS3Service = module.get<S3Service>(S3Service);
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
      id: 1,
      fullName: 'Elmer D. Adams',
      email: 'ElmerDAdams@jourrapide.com',
      password: '$2a$12$CTkW7tuQC4cBn262QB1dcOVCnZaNqT3V230hZ7yYJ/Stg9oKafOsK',
      mobile: '0899999999',
      type: UserType.ADMIN,
      profileImage: `${PATH_USER_IMAGE}name.jpeg`,
      merchantId: 0,
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(fakeS3Service, 'putAsUniqueName').mockResolvedValue({
      url: 'https://s3.com/user/images/name.jpeg',
      origin: {
        Location: 'https://s3.com/user/images/name.jpeg',
        ETag: 'test',
        Bucket: 'test',
        Key: 'test',
      },
    });
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

    const response = await administratorService.store(dtoWithImage);
    expect(response.id).toEqual(mockUser.id);
  });

  it('should be ok if profile image is empty', async () => {
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
    });

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

    const response = await administratorService.store(dto);
    expect(response.id).toEqual(mockUser.id);
  });

  it('should throw exception if upload image error', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      fullName: 'Elmer D. Adams',
      email: 'ElmerDAdams@jourrapide.com',
      password: '$2a$12$CTkW7tuQC4cBn262QB1dcOVCnZaNqT3V230hZ7yYJ/Stg9oKafOsK',
      mobile: '0899999999',
      type: UserType.ADMIN,
      profileImage: `${PATH_USER_IMAGE}name.jpeg`,
      merchantId: 0,
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(fakeS3Service, 'putAsUniqueName').mockResolvedValue(null);

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

    try {
      await administratorService.store(dtoWithImage);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(400001);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'UPLOAD_IMAGE_ERROR',
      );
    }
  });

  it('should throw exception if store error', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(userRepository, 'save').mockRejectedValue(new Error('error'));

    try {
      await administratorService.store(dto);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(100006);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'USER_CREATE_ERROR',
      );
    }
  });

  it('should throw exception if email is exist', async () => {
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
    });

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

    try {
      await administratorService.store(dto);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(100008);
      expect(get(err.getResponse(), 'errorMessage')).toEqual('USER_EXIST');
    }
  });
});
