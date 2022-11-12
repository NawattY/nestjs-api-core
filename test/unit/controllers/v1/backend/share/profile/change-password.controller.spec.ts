import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@services/backend/share/user.service';
import { UserEntity } from '@entities/default/user.entity';
import { ProfileChangePasswordController } from '@controller/v1/backend/share/profile/change-password.controller';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';

describe('ProfileChangePasswordController', () => {
  let controller: ProfileChangePasswordController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileChangePasswordController],
      providers: [
        {
          provide: UserService,
          useValue: {
            changePassword: jest.fn(),
            modify: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProfileChangePasswordController>(
      ProfileChangePasswordController,
    );
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      password: '$2a$12$5IbGrO4ZCOrfRbSNqJziKuR.6HzMnxhwaggxsS4ZgzMFFXKIt6nqq',
    });

    const mockBody = {
      oldPassword: 'password',
      password: 'password1234',
      passwordConfirm: 'password1234',
    };

    jest.spyOn(userService, 'changePassword').mockResolvedValue();

    const response = await controller.changePassword(mockUser, mockBody);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw exception', async (done) => {
    jest
      .spyOn(userService, 'changePassword')
      .mockRejectedValue(new Error('error'));

    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      password: '$2a$12$5IbGrO4ZCOrfRbSNqJziKuR.6HzMnxhwaggxsS4ZgzMFFXKIt6nqq',
    });

    const mockBody = {
      oldPassword: 'password',
      password: 'password1234',
      passwordConfirm: 'password1234',
    };

    try {
      await controller.changePassword(mockUser, mockBody);
    } catch (error) {
      done();
    }
  });
});
