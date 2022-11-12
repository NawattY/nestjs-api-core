import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@entities/default/user.entity';
import { UserService } from '@services/backend/share/user.service';
import { S3Service } from '@appotter/nestjs-s3';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';
import { S3ProviderModule } from '@providers/filesystems/s3/provider.module';
import { I18nService } from 'nestjs-i18n';
import { CreateThumbnailProvider } from '@providers/filesystems/s3/create-thumbnail.provider';
import { UserSecurityCodeEntity } from '@entities/default/user-security-codes.entity';
import { randomUUID } from 'crypto';
import { addMinutes, subMinutes } from 'date-fns';
import { PasswordResetConfirmDto } from '@dtos/v1/backend/share/password-reset/password-reset-confirm.dto';

describe('UserService -> confirmPasswordReset', () => {
  let userService: UserService;
  let userSecurityCodeRepository: Repository<UserSecurityCodeEntity>;
  let userRepository: Repository<UserEntity>;
  const token = randomUUID();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [S3ProviderModule],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserSecurityCodeEntity),
          useValue: {
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: S3Service,
          useValue: {},
        },
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: CreateThumbnailProvider,
          useValue: {},
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userSecurityCodeRepository = module.get<Repository<UserSecurityCodeEntity>>(
      getRepositoryToken(UserSecurityCodeEntity),
    );
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should be ok', async () => {
    const fakeUserSecurityCode: UserSecurityCodeEntity = plainToInstance(
      UserSecurityCodeEntity,
      {
        id: 1,
        userId: 1,
        type: 'password-reset',
        token: token,
        expiredAt: addMinutes(new Date(), 15),
      },
    );

    const fakeDto: PasswordResetConfirmDto = plainToInstance(
      PasswordResetConfirmDto,
      {
        token: token,
        password: '12345678',
        passwordConfirm: '12345678',
      },
    );

    const deleteResult = plainToInstance(DeleteResult, {
      raw: [],
      affected: 1,
    });

    jest
      .spyOn(userSecurityCodeRepository, 'findOne')
      .mockResolvedValue(fakeUserSecurityCode);
    jest
      .spyOn(userSecurityCodeRepository, 'delete')
      .mockResolvedValue(deleteResult);

    const result = await userService.confirmPasswordReset(fakeDto);

    // return void
    expect(result).toBeUndefined();
  });

  it('should be fails if security code not found', async () => {
    const fakeDto: PasswordResetConfirmDto = plainToInstance(
      PasswordResetConfirmDto,
      {
        token: token,
        password: '12345678',
        passwordConfirm: '12345678',
      },
    );

    jest.spyOn(userSecurityCodeRepository, 'findOne').mockResolvedValue(null);

    try {
      await userService.confirmPasswordReset(fakeDto);
    } catch (error) {
      expect(get(error.getResponse(), 'errorCode')).toEqual(100012);
      expect(get(error.getResponse(), 'errorMessage')).toEqual(
        'SECURITY_CODE_NOT_FOUND',
      );
    }
  });

  it('should be fails if security code expired', async () => {
    const fakeUserSecurityCode: UserSecurityCodeEntity = plainToInstance(
      UserSecurityCodeEntity,
      {
        id: 1,
        userId: 1,
        type: 'password-reset',
        token: token,
        expiredAt: subMinutes(new Date(), 5),
      },
    );

    const fakeDto: PasswordResetConfirmDto = plainToInstance(
      PasswordResetConfirmDto,
      {
        token: token,
        password: '12345678',
        passwordConfirm: '12345678',
      },
    );

    jest
      .spyOn(userSecurityCodeRepository, 'findOne')
      .mockResolvedValue(fakeUserSecurityCode);

    try {
      await userService.confirmPasswordReset(fakeDto);
    } catch (error) {
      expect(get(error.getResponse(), 'errorCode')).toEqual(100013);
      expect(get(error.getResponse(), 'errorMessage')).toEqual(
        'SECURITY_CODE_EXPIRED',
      );
    }
  });

  it('should be fails if confirm password reset error', async () => {
    const fakeUserSecurityCode: UserSecurityCodeEntity = plainToInstance(
      UserSecurityCodeEntity,
      {
        id: 1,
        userId: 1,
        type: 'password-reset',
        token: token,
        expiredAt: addMinutes(new Date(), 15),
      },
    );

    const fakeDto: PasswordResetConfirmDto = plainToInstance(
      PasswordResetConfirmDto,
      {
        token: token,
        password: '12345678',
        passwordConfirm: '12345678',
      },
    );

    const updateResult = plainToInstance(UpdateResult, {
      affected: 1,
    });

    jest
      .spyOn(userSecurityCodeRepository, 'findOne')
      .mockResolvedValue(fakeUserSecurityCode);
    jest.spyOn(userRepository, 'update').mockResolvedValue(updateResult);
    jest
      .spyOn(userSecurityCodeRepository, 'delete')
      .mockRejectedValue(new Error('error'));

    try {
      await userService.confirmPasswordReset(fakeDto);
    } catch (error) {
      expect(get(error.getResponse(), 'errorCode')).toEqual(100014);
      expect(get(error.getResponse(), 'errorMessage')).toEqual(
        'CONFIRM_PASSWORD_RESET_ERROR',
      );
    }
  });
});
