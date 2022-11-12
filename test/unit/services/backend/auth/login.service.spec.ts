import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@services/backend/share/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@entities/default/user.entity';
import { AuthAccessTokenEntity } from '@entities/default/auth-access-token.entity';
import { AuthRefreshTokenEntity } from '@entities/default/auth-refresh-token.entity';
import { Repository } from 'typeorm';
import { UserType } from '@enums/user-type';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from 'src/config/app/config.service';
import { ConfigService } from '@nestjs/config';
import { AuthLoginDto } from '@dtos/v1/backend/share/auth/auth-login.dto';
import { randomUUID } from 'crypto';
import { get } from 'lodash';
import { ConfigProviderModule } from '@providers/config/provider.module';

describe('AuthService -> login', () => {
  let userRepository: Repository<UserEntity>;
  let authAccessTokenRepository: Repository<AuthAccessTokenEntity>;
  let authRefreshTokenRepository: Repository<AuthRefreshTokenEntity>;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigProviderModule],
      providers: [
        AuthService,
        JwtService,
        AppConfigService,
        ConfigService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(AuthAccessTokenEntity),
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(AuthRefreshTokenEntity),
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    authAccessTokenRepository = module.get<Repository<AuthAccessTokenEntity>>(
      getRepositoryToken(AuthAccessTokenEntity),
    );
    authRefreshTokenRepository = module.get<Repository<AuthRefreshTokenEntity>>(
      getRepositoryToken(AuthRefreshTokenEntity),
    );
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should be ok', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      fullName: 'hello',
      email: 'test@mail.com',
      // password
      password: '$2a$12$5IbGrO4ZCOrfRbSNqJziKuR.6HzMnxhwaggxsS4ZgzMFFXKIt6nqq',
      profileImage: 'abc.jpg',
      mobile: '0861111111',
      type: UserType.ADMIN,
      merchantId: 0,
      isActive: 1,
    });

    const mockDto: AuthLoginDto = plainToInstance(AuthLoginDto, {
      email: 'test@mail.com',
      password: 'password',
    });

    const mockAccessToken: AuthAccessTokenEntity = plainToInstance(
      AuthAccessTokenEntity,
      {
        id: 1,
        userId: mockUser.id,
        token: randomUUID(),
      },
    );

    const mockRefreshToken: AuthRefreshTokenEntity = plainToInstance(
      AuthRefreshTokenEntity,
      {
        authAccessTokenId: mockAccessToken.id,
        token: randomUUID(),
      },
    );

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    jest
      .spyOn(authAccessTokenRepository, 'save')
      .mockResolvedValue(mockAccessToken);
    jest
      .spyOn(authRefreshTokenRepository, 'save')
      .mockResolvedValue(mockRefreshToken);
    jest.spyOn(jwtService, 'sign').mockReturnValueOnce('access_token');
    jest.spyOn(jwtService, 'sign').mockReturnValueOnce('refresh_token');

    const result = await authService.login(mockDto);

    expect(result.fullName).toEqual(mockUser.fullName);
    expect(result.accessToken).toEqual('access_token');
    expect(result.refreshToken).toEqual('refresh_token');
  });

  it('should be fails if user not found', async () => {
    const mockDto: AuthLoginDto = plainToInstance(AuthLoginDto, {
      email: 'test@mail.com',
      password: 'password',
    });

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    try {
      await authService.login(mockDto);
    } catch (error) {
      expect(get(error.getResponse(), 'errorCode')).toEqual(100001);
      expect(get(error.getResponse(), 'errorMessage')).toEqual(
        'USER_NOT_FOUND',
      );
    }
  });

  it('should be fails if password miss match', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      fullName: 'hello',
      email: 'test@mail.com',
      // password
      password: '$2a$12$5IbGrO4ZCOrfRbSNqJziKuR.6HzMnxhwaggxsS4ZgzMFFXKIt6nqq',
      profileImage: 'abc.jpg',
      mobile: '0861111111',
      type: UserType.ADMIN,
      merchantId: 0,
      isActive: 1,
    });

    const mockDto: AuthLoginDto = plainToInstance(AuthLoginDto, {
      email: 'test@mail.com',
      password: '12345678',
    });

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    try {
      await authService.login(mockDto);
    } catch (error) {
      expect(get(error.getResponse(), 'errorCode')).toEqual(100002);
      expect(get(error.getResponse(), 'errorMessage')).toEqual(
        'USER_CREDENTIALS_MISMATCH',
      );
    }
  });

  it('should be fails if user not active', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      fullName: 'hello',
      email: 'test@mail.com',
      // password
      password: '$2a$12$5IbGrO4ZCOrfRbSNqJziKuR.6HzMnxhwaggxsS4ZgzMFFXKIt6nqq',
      profileImage: 'abc.jpg',
      mobile: '0861111111',
      type: UserType.ADMIN,
      merchantId: 0,
      isActive: 0,
    });

    const mockDto: AuthLoginDto = plainToInstance(AuthLoginDto, {
      email: 'test@mail.com',
      password: 'password',
    });

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    try {
      await authService.login(mockDto);
    } catch (error) {
      expect(get(error.getResponse(), 'errorCode')).toEqual(100003);
      expect(get(error.getResponse(), 'errorMessage')).toEqual('USER_INACTIVE');
    }
  });

  it('should be fails if generate jwt error', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      fullName: 'hello',
      email: 'test@mail.com',
      // password
      password: '$2a$12$5IbGrO4ZCOrfRbSNqJziKuR.6HzMnxhwaggxsS4ZgzMFFXKIt6nqq',
      profileImage: 'abc.jpg',
      mobile: '0861111111',
      type: UserType.ADMIN,
      merchantId: 0,
      isActive: 1,
    });

    const mockDto: AuthLoginDto = plainToInstance(AuthLoginDto, {
      email: 'test@mail.com',
      password: 'password',
    });

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    jest
      .spyOn(authAccessTokenRepository, 'save')
      .mockRejectedValue(new Error('error'));

    try {
      await authService.login(mockDto);
    } catch (error) {
      expect(get(error.getResponse(), 'errorCode')).toEqual(300003);
      expect(get(error.getResponse(), 'errorMessage')).toEqual(
        'AUTH_GENERATE_JWT_ERROR',
      );
    }
  });
});
