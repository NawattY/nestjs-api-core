import { Test, TestingModule } from '@nestjs/testing';
import { AuthLogoutController } from '@controller/v1/backend/share/auth/auth-logout.controller';
import { AuthService } from '@services/backend/share/auth.service';
import { UserEntity } from '@entities/default/user.entity';
import { get } from 'lodash';
import { UserType } from '@enums/user-type';
import { plainToInstance } from 'class-transformer';

describe('AuthLogoutController', () => {
  let controller: AuthLogoutController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AuthLogoutController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            logout: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthLogoutController>(AuthLogoutController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });

  it('should logout ok', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      firstName: 'hello',
      lastName: 'wow',
      email: 'test',
      password: '$2a$12$CTkW7tuQC4cBn262QB1dcOVCnZaNqT3V230hZ7yYJ/Stg9oKafOsK',
      profileImage: null,
      mobile: '',
      type: UserType.MERCHANT,
      merchantId: 1,
      isActive: 1,
    });

    jest.spyOn(authService, 'logout').mockResolvedValue();

    const response = await controller.logout(mockUser);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw exception', async (done) => {
    jest.spyOn(authService, 'logout').mockRejectedValue(new Error('error'));

    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      firstName: 'hello',
      lastName: 'wow',
      email: 'test',
      password: '$2a$12$CTkW7tuQC4cBn262QB1dcOVCnZaNqT3V230hZ7yYJ/Stg9oKafOsK',
      profileImage: null,
      mobile: '',
      type: UserType.MERCHANT,
      merchantId: 1,
      isActive: 1,
    });

    try {
      await controller.logout(mockUser);
    } catch (error) {
      done();
    }
  });
});
