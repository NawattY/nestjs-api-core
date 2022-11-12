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

describe('AuthService -> logout', () => {
  let authAccessTokenRepository: Repository<AuthAccessTokenEntity>;
  let authRefreshTokenRepository: Repository<AuthRefreshTokenEntity>;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthService,
        JwtService,
        AppConfigService,
        ConfigService,
        { provide: getRepositoryToken(UserEntity), useClass: Repository },
        {
          provide: getRepositoryToken(AuthAccessTokenEntity),
          useValue: {
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(AuthRefreshTokenEntity),
          useValue: {
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    authAccessTokenRepository = module.get<Repository<AuthAccessTokenEntity>>(
      getRepositoryToken(AuthAccessTokenEntity),
    );
    authRefreshTokenRepository = module.get<Repository<AuthRefreshTokenEntity>>(
      getRepositoryToken(AuthRefreshTokenEntity),
    );
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should logout ok', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      fullName: 'hello',
      email: 'test',
      password: '$2a$12$CTkW7tuQC4cBn262QB1dcOVCnZaNqT3V230hZ7yYJ/Stg9oKafOsK',
      profileImage: '',
      mobile: '',
      type: UserType.MERCHANT,
      merchantId: 1,
      isActive: 1,
    });

    const mockAuthAccessToken: AuthAccessTokenEntity = plainToInstance(
      AuthAccessTokenEntity,
      {
        id: 1,
        userId: mockUser.id,
        token: 'test-access-token',
      },
    );

    jest
      .spyOn(authAccessTokenRepository, 'findOne')
      .mockResolvedValue(mockAuthAccessToken);
    const deleteRefreshToken = jest.spyOn(authRefreshTokenRepository, 'delete');
    const deleteAccessToken = jest.spyOn(authAccessTokenRepository, 'delete');

    await authService.logout(mockUser);

    expect(deleteRefreshToken).toBeCalledWith({
      authAccessTokenId: mockAuthAccessToken.id,
    });
    expect(deleteAccessToken).toBeCalledWith(mockAuthAccessToken.id);
  });
});
