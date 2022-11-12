import { Test, TestingModule } from '@nestjs/testing';
import { get } from 'lodash';
import { PasswordResetRequestController } from '@controller/v1/backend/share/password-reset/password-reset-request.controller';
import { PasswordResetService } from '@services/backend/share/password-reset.service';
import { PasswordResetRequestDto } from '@dtos/v1/backend/share/password-reset/password-reset-request.dto';
import { MailService } from '@providers/mail/mail.service';
import { addMinutes } from 'date-fns';

const dto = {
  email: 'test@mail.com',
} as PasswordResetRequestDto;

describe('PasswordResetRequestController', () => {
  let controller: PasswordResetRequestController;
  let fakePasswordResetService: Partial<PasswordResetService>;
  let mailService: Partial<MailService>;

  beforeEach(async () => {
    fakePasswordResetService = {
      request: jest.fn(),
    };

    mailService = {
      sendRequestPassword: () => Promise.resolve(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordResetRequestController],
      providers: [
        {
          provide: PasswordResetService,
          useValue: fakePasswordResetService,
        },
        {
          provide: MailService,
          useValue: mailService,
        },
      ],
    }).compile();

    mailService = module.get<MailService>(MailService);
    controller = module.get<PasswordResetRequestController>(
      PasswordResetRequestController,
    );
  });

  it('should return ok', async () => {
    jest.spyOn(fakePasswordResetService, 'request').mockResolvedValue({
      expiredAt: addMinutes(new Date(), 30),
    });

    const response = await controller.request(dto);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw an exception', async (done) => {
    jest
      .spyOn(fakePasswordResetService, 'request')
      .mockRejectedValue(new Error('error'));

    jest
      .spyOn(mailService, 'sendRequestPassword')
      .mockRejectedValue(new Error('error'));

    try {
      await controller.request(dto);
    } catch (error) {
      done();
    }
  });
});
