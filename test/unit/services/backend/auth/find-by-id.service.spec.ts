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

describe('AuthService -> findById', () => {
  let userRepository: Repository<UserEntity>;
  let authService: AuthService;

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
          useValue: {},
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
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should be ok', async () => {
    const params = {
      include: 'merchant',
    };
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      fullName: 'hello',
      email: 'test@mail.com',
      // password
      password: '$2a$12$5IbGrO4ZCOrfRbSNqJziKuR.6HzMnxhwaggxsS4ZgzMFFXKIt6nqq',
      profileImage: 'abc.jpg',
      mobile: '0861111111',
      type: UserType.MERCHANT,
      merchantId: 1,
      isActive: 1,
    });

    jest
      .spyOn(userRepository, 'createQueryBuilder')
      .mockImplementation((): any => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      }));

    const result = await authService.findById(1, params);

    expect(result.id).toEqual(mockUser.id);
  });

  it('should be fails if user not found', async () => {
    const params = {};

    jest
      .spyOn(userRepository, 'createQueryBuilder')
      .mockImplementation((): any => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }));

    try {
      await authService.findById(1, params);
    } catch (error) {
      expect(get(error.getResponse(), 'errorCode')).toEqual(100001);
      expect(get(error.getResponse(), 'errorMessage')).toEqual(
        'USER_NOT_FOUND',
      );
    }
  });
});
