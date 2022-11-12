import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@services/backend/share/user.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UserEntity } from '@entities/default/user.entity';
import { ProfileUpdateController } from '@controller/v1/backend/share/profile/update.controller';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';

describe('ProfileUpdateController', () => {
  let controller: ProfileUpdateController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NestjsFormDataModule],
      controllers: [ProfileUpdateController],
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

    controller = module.get<ProfileUpdateController>(ProfileUpdateController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      fullName: 'foo bar',
      mobile: '0822222222',
      profileImage: null,
    });

    const mockBody = {
      fullName: 'first name',
      mobile: '0811111111',
      profileImage: null,
    };

    jest.spyOn(userService, 'modify').mockResolvedValue(mockUser);

    const response = await controller.update(mockUser, mockBody);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(get(response, 'data.id')).toEqual(mockUser.id);
  });

  it('throw exception', async (done) => {
    jest.spyOn(userService, 'modify').mockRejectedValue(new Error('error'));

    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      fullName: 'foo bar',
      mobile: '0822222222',
      profileImage: null,
    });

    const mockBody = {
      fullName: 'first name',
      mobile: '0811111111',
      profileImage: null,
    };

    try {
      await controller.update(mockUser, mockBody);
    } catch (error) {
      done();
    }
  });
});
