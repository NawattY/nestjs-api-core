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
import { get } from 'lodash';
import { subMinutes } from 'date-fns';

describe('AuthService -> refreshToken', () => {
  let userRepository: Repository<UserEntity>;
  let authService: AuthService;
  let authAccessTokenRepository: Repository<AuthAccessTokenEntity>;
  let authRefreshTokenRepository: Repository<AuthRefreshTokenEntity>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthService,
        JwtService,
        AppConfigService,
        ConfigService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(AuthAccessTokenEntity),
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(AuthRefreshTokenEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    authService = module.get<AuthService>(AuthService);
    authRefreshTokenRepository = module.get<Repository<AuthRefreshTokenEntity>>(
      getRepositoryToken(AuthRefreshTokenEntity),
    );
    authAccessTokenRepository = module.get<Repository<AuthAccessTokenEntity>>(
      getRepositoryToken(AuthAccessTokenEntity),
    );
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should be ok', async () => {
    const mockAccessToken: AuthAccessTokenEntity = plainToInstance(
      AuthAccessTokenEntity,
      {
        id: 1,
        userId: 1,
        token: 'access_token',
      },
    );
    const mockRefreshToken: AuthRefreshTokenEntity = plainToInstance(
      AuthRefreshTokenEntity,
      {
        authAccessTokenId: mockAccessToken.id,
        token: 'refresh_token',
        authAccessToken: {
          userId: mockAccessToken.userId,
        },
      },
    );
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

    jest
      .spyOn(authRefreshTokenRepository, 'createQueryBuilder')
      .mockImplementation((): any => ({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockRefreshToken),
      }));
    jest
      .spyOn(userRepository, 'createQueryBuilder')
      .mockImplementation((): any => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      }));
    jest.spyOn(jwtService, 'sign').mockReturnValueOnce('gen_access_token');
    jest.spyOn(jwtService, 'sign').mockReturnValueOnce('gen_refresh_token');

    const result = await authService.refreshToken('refresh_token');

    expect(result.accessToken).toEqual('gen_access_token');
    expect(result.refreshToken).toEqual('gen_refresh_token');
  });

  it('should be ok when refresh token expired', async () => {
    const mockAccessTokenA: AuthAccessTokenEntity = plainToInstance(
      AuthAccessTokenEntity,
      {
        id: 1,
        userId: 1,
        token: 'access_token',
      },
    );
    const mockRefreshTokenA: AuthRefreshTokenEntity = plainToInstance(
      AuthRefreshTokenEntity,
      {
        authAccessTokenId: mockAccessTokenA.id,
        token: 'refresh_token',
        expiredAt: new Date(subMinutes(new Date(), 5)),
        authAccessToken: {
          userId: mockAccessTokenA.userId,
        },
      },
    );
    const mockAccessTokenB: AuthAccessTokenEntity = plainToInstance(
      AuthAccessTokenEntity,
      {
        id: 2,
        userId: 1,
        token: 'access_token_a',
      },
    );
    const mockRefreshTokenB: AuthRefreshTokenEntity = plainToInstance(
      AuthRefreshTokenEntity,
      {
        authAccessTokenId: mockAccessTokenA.id,
        token: 'refresh_token_b',
        authAccessToken: {
          userId: mockAccessTokenA.userId,
        },
      },
    );
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

    jest
      .spyOn(authRefreshTokenRepository, 'createQueryBuilder')
      .mockImplementation((): any => ({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockRefreshTokenA),
      }));
    jest
      .spyOn(userRepository, 'createQueryBuilder')
      .mockImplementation((): any => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      }));
    jest.spyOn(jwtService, 'sign').mockReturnValueOnce('gen_access_token');
    jest.spyOn(jwtService, 'sign').mockReturnValueOnce('gen_refresh_token');
    jest.spyOn(authRefreshTokenRepository, 'delete').mockImplementation();
    jest
      .spyOn(authAccessTokenRepository, 'save')
      .mockResolvedValue(mockAccessTokenB);
    jest
      .spyOn(authRefreshTokenRepository, 'save')
      .mockResolvedValue(mockRefreshTokenB);
    jest.spyOn(jwtService, 'sign').mockReturnValueOnce('new_access_token');
    jest.spyOn(jwtService, 'sign').mockReturnValueOnce('new_refresh_token');

    const result = await authService.refreshToken('refresh_token');

    expect(result.accessToken).toEqual('new_access_token');
    expect(result.refreshToken).toEqual('new_refresh_token');
  });

  it('should be fails if refresh token error', async () => {
    const mockAccessToken: AuthAccessTokenEntity = plainToInstance(
      AuthAccessTokenEntity,
      {
        id: 1,
        userId: 1,
        token: 'access_token',
      },
    );
    const mockRefreshToken: AuthRefreshTokenEntity = plainToInstance(
      AuthRefreshTokenEntity,
      {
        authAccessTokenId: mockAccessToken.id,
        token: 'refresh_token',
        expiredAt: new Date(subMinutes(new Date(), 5)),
        authAccessToken: {
          userId: mockAccessToken.userId,
        },
      },
    );

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

    jest
      .spyOn(authRefreshTokenRepository, 'createQueryBuilder')
      .mockImplementation((): any => ({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockRefreshToken),
      }));
    jest
      .spyOn(userRepository, 'createQueryBuilder')
      .mockImplementation((): any => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      }));
    jest.spyOn(jwtService, 'sign').mockReturnValueOnce('access_token');
    jest.spyOn(jwtService, 'sign').mockReturnValueOnce('refresh_token');
    jest
      .spyOn(authRefreshTokenRepository, 'delete')
      .mockRejectedValue(new Error('error'));

    try {
      await authService.refreshToken('refresh_token');
    } catch (error) {
      expect(get(error.getResponse(), 'errorCode')).toEqual(300002);
      expect(get(error.getResponse(), 'errorMessage')).toEqual(
        'AUTH_REFRESH_TOKEN_ERROR',
      );
    }
  });

  it('should be fails if refresh token not found', async () => {
    jest
      .spyOn(authRefreshTokenRepository, 'createQueryBuilder')
      .mockImplementation((): any => ({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }));

    try {
      await authService.refreshToken('refresh_token');
    } catch (error) {
      expect(get(error.getResponse(), 'errorCode')).toEqual(300001);
      expect(get(error.getResponse(), 'errorMessage')).toEqual(
        'AUTH_REFRESH_TOKEN_NOT_FOUND',
      );
    }
  });
});
