import { Test, TestingModule } from '@nestjs/testing';
import { UserType } from '@enums/user-type';
import { get } from 'lodash';
import { UserEntity } from '@entities/default/user.entity';
import { ProfileGetController } from '@controller/v1/backend/share/profile/get.controller';
import { AuthService } from '@services/backend/share/auth.service';
import { plainToInstance } from 'class-transformer';

describe('ProfileGetProfile', () => {
  let controller: ProfileGetController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileGetController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProfileGetController>(ProfileGetController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 10,
      fullName: 'hello hello',
      email: 'test@mail.com',
      password: '$2a$12$CTkW7tuQC4cBn262QB1dcOVCnZaNqT3V230hZ7yYJ/Stg9oKafOsK',
      profileImage: null,
      mobile: '',
      type: UserType.ADMIN,
      merchantId: 1,
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    jest.spyOn(authService, 'findById').mockResolvedValue(mockUser);

    const response = await controller.getProfile(mockUser.id);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(get(response, 'data.id')).toEqual(mockUser.id);
  });

  it('throw exception', async (done) => {
    jest.spyOn(authService, 'findById').mockRejectedValue(new Error('error'));

    try {
      await controller.getProfile(1);
    } catch (error) {
      done();
    }
  });
});
