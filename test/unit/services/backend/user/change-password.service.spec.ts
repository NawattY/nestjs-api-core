import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@entities/default/user.entity';
import { UserService } from '@services/backend/share/user.service';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ChangePasswordDto } from '@dtos/v1/backend/share/profile/change-password.dto';
import { get } from 'lodash';
import { S3ProviderModule } from '@providers/filesystems/s3/provider.module';
import { UserSecurityCodeEntity } from '@entities/default/user-security-codes.entity';
import { S3Service } from '@appotter/nestjs-s3';
import { I18nService } from 'nestjs-i18n';
import { CreateThumbnailProvider } from '@providers/filesystems/s3/create-thumbnail.provider';

describe('UserService -> changePassword', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
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
          useValue: {
            putAsUniqueName: jest.fn(),
            delete: jest.fn(),
          },
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
      profileImage: null,
      isActive: 1,
      // password
      password: '$2a$12$5IbGrO4ZCOrfRbSNqJziKuR.6HzMnxhwaggxsS4ZgzMFFXKIt6nqq',
    });

    const mockDto = plainToInstance(ChangePasswordDto, {
      oldPassword: 'password',
      password: 'supersecret',
      passwordConfirm: 'supersecret',
    });

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    const changed = await userService.changePassword(mockUser, mockDto);

    // return void
    expect(changed).toBeUndefined();
  });

  it('should be fails if old password wrong', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      fullName: 'foo bar',
      mobile: '0822222222',
      profileImage: null,
      isActive: 1,
      // password
      password: '$2a$12$5IbGrO4ZCOrfRbSNqJziKuR.6HzMnxhwaggxsS4ZgzMFFXKIt6nqq',
    });

    const mockDto = plainToInstance(ChangePasswordDto, {
      oldPassword: '12345678',
      password: 'password1234',
      passwordConfirm: 'password1234',
    });

    try {
      await userService.changePassword(mockUser, mockDto);
    } catch (error) {
      expect(get(error.getResponse(), 'errorCode')).toEqual(100010);
      expect(get(error.getResponse(), 'errorMessage')).toEqual(
        'OLD_PASSWORD_WAS_WRONG',
      );
    }
  });

  it('should be fails if new password duplicate old password', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      fullName: 'foo bar',
      mobile: '0822222222',
      profileImage: null,
      isActive: 1,
      // password
      password: '$2a$12$5IbGrO4ZCOrfRbSNqJziKuR.6HzMnxhwaggxsS4ZgzMFFXKIt6nqq',
    });

    const mockDto = plainToInstance(ChangePasswordDto, {
      oldPassword: 'password',
      password: 'password',
      passwordConfirm: 'password',
    });

    try {
      await userService.changePassword(mockUser, mockDto);
    } catch (error) {
      expect(get(error.getResponse(), 'errorCode')).toEqual(100011);
      expect(get(error.getResponse(), 'errorMessage')).toEqual(
        'PASSWORD_DUPLICATE',
      );
    }
  });

  it('should be fails if cannot update', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      fullName: 'foo bar',
      mobile: '0822222222',
      profileImage: null,
      isActive: 1,
      // password
      password: '$2a$12$5IbGrO4ZCOrfRbSNqJziKuR.6HzMnxhwaggxsS4ZgzMFFXKIt6nqq',
    });

    const mockDto = plainToInstance(ChangePasswordDto, {
      oldPassword: 'password',
      password: 'password1234',
      passwordConfirm: 'password1234',
    });

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(userRepository, 'save').mockRejectedValue(new Error('error'));

    try {
      await userService.changePassword(mockUser, mockDto);
    } catch (error) {
      expect(get(error.getResponse(), 'errorCode')).toEqual(100009);
      expect(get(error.getResponse(), 'errorMessage')).toEqual(
        'USER_CHANGE_PASSWORD_ERROR',
      );
    }
  });
});
