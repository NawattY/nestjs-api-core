import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '@services/backend/share/user.service';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';
import { UserSecurityCodeEntity } from '@entities/default/user-security-codes.entity';
import { format, addMinutes, subMinutes } from 'date-fns';
import { randomUUID } from 'crypto';
import { S3ProviderModule } from '@providers/filesystems/s3/provider.module';
import { UserEntity } from '@entities/default/user.entity';
import { S3Service } from '@appotter/nestjs-s3';
import { I18nService } from 'nestjs-i18n';
import { CreateThumbnailProvider } from '@providers/filesystems/s3/create-thumbnail.provider';

describe('UserService -> checkPasswordReset', () => {
  let userService: UserService;
  let userSecurityCodeRepository: Repository<UserSecurityCodeEntity>;

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
    userSecurityCodeRepository = module.get<Repository<UserSecurityCodeEntity>>(
      getRepositoryToken(UserSecurityCodeEntity),
    );
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should be ok', async () => {
    const mockUserSecurityCode: UserSecurityCodeEntity = plainToInstance(
      UserSecurityCodeEntity,
      {
        userId: 1,
        type: 'password-reset',
        token: randomUUID(),
        expiredAt: format(addMinutes(new Date(), 15), 'yyyy-MM-dd HH:mm:ss'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    );

    jest
      .spyOn(userSecurityCodeRepository, 'findOne')
      .mockResolvedValue(mockUserSecurityCode);

    await userService.checkPasswordReset(mockUserSecurityCode.token);
  });

  it('should be fails if security code not found', async () => {
    jest.spyOn(userSecurityCodeRepository, 'findOne').mockResolvedValue(null);

    try {
      await userService.checkPasswordReset('test-token');
    } catch (error) {
      expect(get(error.getResponse(), 'errorCode')).toEqual(100012);
      expect(get(error.getResponse(), 'errorMessage')).toEqual(
        'SECURITY_CODE_NOT_FOUND',
      );
    }
  });

  it('should be fails if security code expired', async () => {
    const mockUserSecurityCode: UserSecurityCodeEntity = plainToInstance(
      UserSecurityCodeEntity,
      {
        userId: 1,
        type: 'password-reset',
        token: randomUUID(),
        expiredAt: format(subMinutes(new Date(), 5), 'yyyy-MM-dd HH:mm:ss'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    );

    jest
      .spyOn(userSecurityCodeRepository, 'findOne')
      .mockResolvedValue(mockUserSecurityCode);

    try {
      await userService.checkPasswordReset(mockUserSecurityCode.token);
    } catch (error) {
      expect(get(error.getResponse(), 'errorCode')).toEqual(100013);
      expect(get(error.getResponse(), 'errorMessage')).toEqual(
        'SECURITY_CODE_EXPIRED',
      );
    }
  });
});
