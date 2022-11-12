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

describe('AuthService -> getUserByAccessToken', () => {
  let userRepository: Repository<UserEntity>;
  let authService: AuthService;
  let authAccessTokenRepository: Repository<AuthAccessTokenEntity>;
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
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(AuthRefreshTokenEntity),
          useValue: {},
        },
      ],
    }).compile();

    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    authService = module.get<AuthService>(AuthService);
    authAccessTokenRepository = module.get<Repository<AuthAccessTokenEntity>>(
      getRepositoryToken(AuthAccessTokenEntity),
    );
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should be ok', async () => {
    const mockVerifyJwt = { jti: 'access_token' };
    const mockAccessToken: AuthAccessTokenEntity = plainToInstance(
      AuthAccessTokenEntity,
      {
        id: 1,
        userId: 1,
        token: 'access_token',
      },
    );
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: mockAccessToken.userId,
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

    jest.spyOn(jwtService, 'verify').mockReturnValue(mockVerifyJwt);
    jest
      .spyOn(authAccessTokenRepository, 'findOne')
      .mockResolvedValue(mockAccessToken);
    jest
      .spyOn(userRepository, 'createQueryBuilder')
      .mockImplementation((): any => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      }));

    const result = await authService.getUserByAccessToken('access_token');

    expect(result.id).toEqual(mockUser.id);
  });

  it('should be fails if access token not found', async () => {
    const mockVerifyJwt = { jti: 'access_token' };

    jest.spyOn(jwtService, 'verify').mockReturnValue(mockVerifyJwt);
    jest.spyOn(authAccessTokenRepository, 'findOne').mockResolvedValue(null);

    try {
      await authService.getUserByAccessToken('access_token');
    } catch (error) {
      expect(get(error.getResponse(), 'statusCode')).toEqual(401);
      expect(get(error.getResponse(), 'message')).toEqual('Unauthorized');
    }
  });

  it('should be fails if user not found', async () => {
    const mockVerifyJwt = { jti: 'access_token' };
    const mockAccessToken: AuthAccessTokenEntity = plainToInstance(
      AuthAccessTokenEntity,
      {
        id: 1,
        userId: 1,
        token: 'access_token',
      },
    );

    jest.spyOn(jwtService, 'verify').mockReturnValue(mockVerifyJwt);
    jest
      .spyOn(authAccessTokenRepository, 'findOne')
      .mockResolvedValue(mockAccessToken);
    jest
      .spyOn(userRepository, 'createQueryBuilder')
      .mockImplementation((): any => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }));

    try {
      await authService.getUserByAccessToken('access_token');
    } catch (error) {
      expect(get(error.getResponse(), 'statusCode')).toEqual(401);
      expect(get(error.getResponse(), 'message')).toEqual('Unauthorized');
    }
  });

  it('should be fails if get data error', async () => {
    const mockVerifyJwt = { jti: 'access_token' };

    jest.spyOn(jwtService, 'verify').mockReturnValue(mockVerifyJwt);
    jest
      .spyOn(authAccessTokenRepository, 'findOne')
      .mockRejectedValue(new Error('error'));

    try {
      await authService.getUserByAccessToken('access_token');
    } catch (error) {
      expect(get(error.getResponse(), 'statusCode')).toEqual(401);
      expect(get(error.getResponse(), 'message')).toEqual('Unauthorized');
    }
  });
});
