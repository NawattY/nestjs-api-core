import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@entities/default/user.entity';
import { UserService } from '@services/backend/share/user.service';
import { S3Service } from '@appotter/nestjs-s3';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ProfileUpdateDto } from '@dtos/v1/backend/profile-update.dto';
import { MemoryStoredFile } from 'nestjs-form-data';
import { get } from 'lodash';
import { PATH_USER_IMAGE } from '@constants/path-upload';
import { S3ProviderModule } from '@providers/filesystems/s3/provider.module';
import { I18nService } from 'nestjs-i18n';
import { CreateThumbnailProvider } from '@providers/filesystems/s3/create-thumbnail.provider';
import { UserSecurityCodeEntity } from '@entities/default/user-security-codes.entity';

describe('UserService -> modify', () => {
  let userService: UserService;
  let fakeS3Service: Partial<S3Service>;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    fakeS3Service = {
      putAsUniqueName: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [S3ProviderModule],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserSecurityCodeEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: S3Service,
          useValue: fakeS3Service,
        },
        {
          provide: I18nService,
          useValue: {
            t: jest.fn(),
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

    userService = module.get<UserService>(UserService);
    fakeS3Service = module.get<S3Service>(S3Service);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should be ok', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      fullName: 'foo bar',
      mobile: '0822222222',
      profileImage: 'abc.jpg',
    });

    const mockDto = plainToInstance(ProfileUpdateDto, {
      fullName: 'first name',
      mobile: '0811111111',
      profileImage: plainToInstance(MemoryStoredFile, {
        originalName: 'name.jpeg',
        mimetype: 'image/jpeg',
        size: 10000,
        buffer: Buffer.alloc(10000),
      }),
    });

    const mockS3DeleteResponse = {
      status: true,
      origin: {},
    };

    jest
      .spyOn(userService, 'uploadImageToS3')
      .mockResolvedValue(`${PATH_USER_IMAGE}name.jpeg`);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);
    jest
      .spyOn(fakeS3Service, 'delete')
      .mockResolvedValueOnce(mockS3DeleteResponse);
    jest
      .spyOn(fakeS3Service, 'delete')
      .mockResolvedValueOnce(mockS3DeleteResponse);

    const result = await userService.modify(mockUser, mockDto);

    expect(result.id).toEqual(mockUser.id);
  });

  it('should be ok if profile image is empty', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      fullName: 'foo bar',
      mobile: '0822222222',
      profileImage: 'abc.jpg',
    });

    const mockDto = plainToInstance(ProfileUpdateDto, {
      fullName: 'first name',
      mobile: '0811111111',
      profileImage: '',
    });

    const mockS3DeleteResponse = {
      status: true,
      origin: {},
    };

    jest
      .spyOn(fakeS3Service, 'delete')
      .mockResolvedValueOnce(mockS3DeleteResponse);
    jest
      .spyOn(fakeS3Service, 'delete')
      .mockResolvedValueOnce(mockS3DeleteResponse);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

    const result = await userService.modify(mockUser, mockDto);

    expect(result.id).toEqual(mockUser.id);
  });

  it('should be fails if cannot upload image to s3', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      fullName: 'foo bar',
      mobile: '0822222222',
      profileImage: null,
      isActive: 1,
    });

    const mockDto = plainToInstance(ProfileUpdateDto, {
      fullName: 'first name',
      mobile: '0811111111',
      profileImage: plainToInstance(MemoryStoredFile, {
        originalName: 'name.jpeg',
        mimetype: 'image/jpeg',
        size: 89410,
        buffer: Buffer.alloc(1024 * 1024 * 10, '.'),
      }),
    });

    jest
      .spyOn(fakeS3Service, 'putAsUniqueName')
      .mockRejectedValue(new Error('error'));

    try {
      await userService.modify(mockUser, mockDto);
    } catch (error) {
      expect(get(error.getResponse(), 'errorCode')).toEqual(400001);
      expect(get(error.getResponse(), 'errorMessage')).toEqual(
        'UPLOAD_IMAGE_ERROR',
      );
    }
  });

  it('should be fails if cannot update', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      fullName: 'foo bar',
      mobile: '0822222222',
      profileImage: null,
    });

    const mockDto = plainToInstance(ProfileUpdateDto, {
      fullName: 'first name',
      mobile: '0811111111',
      profileImage: plainToInstance(MemoryStoredFile, {
        originalName: 'name.jpeg',
        mimetype: 'image/jpeg',
        size: 10000,
        buffer: Buffer.alloc(10000),
      }),
    });

    jest
      .spyOn(userService, 'uploadImageToS3')
      .mockResolvedValue(`${PATH_USER_IMAGE}name.jpeg`);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(userRepository, 'save').mockRejectedValue(new Error('error'));

    try {
      await userService.modify(mockUser, mockDto);
    } catch (error) {
      expect(get(error.getResponse(), 'errorCode')).toEqual(100007);
      expect(get(error.getResponse(), 'errorMessage')).toEqual(
        'USER_UPDATE_ERROR',
      );
    }
  });
});
