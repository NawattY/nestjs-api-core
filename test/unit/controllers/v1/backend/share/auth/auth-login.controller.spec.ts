import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@services/backend/share/auth.service';
import { UserEntity } from '@entities/default/user.entity';
import { UserType } from '@enums/user-type';
import { AuthLoginController } from '@controller/v1/backend/share/auth/auth-login.controller';
import { plainToInstance } from 'class-transformer';
import { randomUUID } from 'crypto';
import { get } from 'lodash';

describe('AuthLoginController', () => {
  let controller: AuthLoginController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthLoginController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthLoginController>(AuthLoginController);
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

    const mockDataLogin = {
      fullName: mockUser.fullName,
      profileImage: mockUser.profileImage,
      type: mockUser.type,
      accessToken: randomUUID(),
      refreshToken: randomUUID(),
    };

    const payload = {
      email: 'test@mail.com',
      password: '12345678',
    };

    jest.spyOn(authService, 'login').mockResolvedValue(mockDataLogin);

    const response = await controller.login(payload);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(get(response, 'data.fullName')).toEqual(mockDataLogin.fullName);
  });

  it('throw exception', async (done) => {
    jest.spyOn(authService, 'login').mockRejectedValue(new Error('error'));

    const payload = {
      email: 'test@mail.com',
      password: '12345678',
    };

    try {
      await controller.login(payload);
    } catch (error) {
      done();
    }
  });
});
