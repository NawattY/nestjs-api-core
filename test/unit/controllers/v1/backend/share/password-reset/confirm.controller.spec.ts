import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { get } from 'lodash';
import { PasswordResetConfirmController } from '@controller/v1/backend/share/password-reset/confirm.controller';
import { UserService } from '@services/backend/share/user.service';
import { PasswordForgotResetDto } from '@dtos/v1/backend/share/password-reset/password-forgot-reset.dto';

const mockToken = randomUUID();

const dto = {
  token: mockToken,
  password: 'password',
  passwordConfirm: 'password',
} as PasswordForgotResetDto;

describe('PasswordResetConfirmController', () => {
  let controller: PasswordResetConfirmController;
  let fakeUserService: Partial<UserService>;

  beforeEach(async () => {
    fakeUserService = {
      confirmPasswordReset: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordResetConfirmController],
      providers: [
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    controller = module.get<PasswordResetConfirmController>(
      PasswordResetConfirmController,
    );
  });

  it('should return ok', async () => {
    jest.spyOn(fakeUserService, 'confirmPasswordReset').mockResolvedValue();

    const response = await controller.confirmPasswordReset(dto);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw an exception', async (done) => {
    jest
      .spyOn(fakeUserService, 'confirmPasswordReset')
      .mockRejectedValue(new Error('error'));

    try {
      await controller.confirmPasswordReset(dto);
    } catch (error) {
      done();
    }
  });
});
