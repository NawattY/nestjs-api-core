import { Test, TestingModule } from '@nestjs/testing';
import { PasswordResetCheckTokenController } from '@controller/v1/backend/share/password-reset/check-token.controller';
import { randomUUID } from 'crypto';
import { get } from 'lodash';
import { UserService } from '@services/backend/share/user.service';
import { UserSecurityCodeEntity } from '@entities/default/user-security-codes.entity';
import { plainToInstance } from 'class-transformer';

describe('GetPasswordReset', () => {
  let controller: PasswordResetCheckTokenController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordResetCheckTokenController],
      providers: [
        {
          provide: UserService,
          useValue: {
            checkPasswordReset: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PasswordResetCheckTokenController>(
      PasswordResetCheckTokenController,
    );
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    const mockToken = randomUUID();

    const mockUseSecurityCoder: UserSecurityCodeEntity = plainToInstance(
      UserSecurityCodeEntity,
      {
        token: mockToken,
        expiredAt: new Date(),
      },
    );

    jest
      .spyOn(userService, 'checkPasswordReset')
      .mockResolvedValue(mockUseSecurityCoder);

    const response = await controller.checkPasswordReset(mockToken);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(get(response, 'data.expiredAt')).toEqual(
      mockUseSecurityCoder.expiredAt,
    );
  });

  it('throw exception', async (done) => {
    jest
      .spyOn(userService, 'checkPasswordReset')
      .mockRejectedValue(new Error('error'));

    const mockToken = randomUUID();

    try {
      await controller.checkPasswordReset(mockToken);
    } catch (error) {
      done();
    }
  });
});
