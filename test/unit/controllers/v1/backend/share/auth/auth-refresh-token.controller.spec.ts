import { AuthRefreshTokenController } from '@controller/v1/backend/share/auth/auth-refresh-token.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@services/backend/share/auth.service';
import { AuthRefreshDto } from '@dtos/v1/backend/share/auth/auth-refresh.dto';
import { UserEntity } from 'src/app/entities/default/user.entity';
import { UserType } from 'src/app/common/enums/user-type';
import { randomUUID } from 'crypto';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';

describe('AuthRefreshTokenController', () => {
  let controller: AuthRefreshTokenController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AuthRefreshTokenController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            refreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthRefreshTokenController>(
      AuthRefreshTokenController,
    );
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 10,
      fullName: 'hello',
      email: 'test@mail.com',
      profileImage: null,
      type: UserType.MERCHANT,
    });

    const mockDataRefreshToken = {
      fullName: mockUser.fullName,
      profileImage: mockUser.profileImage,
      type: mockUser.type,
      accessToken: randomUUID(),
      refreshToken: randomUUID(),
    };

    const mockDto: AuthRefreshDto = plainToInstance(AuthRefreshDto, {
      refreshToken: randomUUID(),
    });

    jest
      .spyOn(authService, 'refreshToken')
      .mockResolvedValue(mockDataRefreshToken);

    const response = await controller.refreshToken(mockDto);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(get(response, 'data.fullName')).toEqual(
      mockDataRefreshToken.fullName,
    );
  });

  it('throw exception', async (done) => {
    jest
      .spyOn(authService, 'refreshToken')
      .mockRejectedValue(new Error('error'));

    const mockDto: AuthRefreshDto = plainToInstance(AuthRefreshDto, {
      refreshToken: randomUUID(),
    });

    try {
      await controller.refreshToken(mockDto);
    } catch (error) {
      done();
    }
  });
});
