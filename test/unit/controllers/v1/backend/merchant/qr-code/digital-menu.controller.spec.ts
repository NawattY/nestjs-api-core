import { Test, TestingModule } from '@nestjs/testing';
import { get } from 'lodash';
import { QrCodeDigitalMenuController } from '@controller/v1/backend/merchant/qr-code/qr-code-digital-menu.controller';
import { QrCodeService } from '@services/backend/qr-code.service';

describe('QrCodeDigitalMenuController', () => {
  let controller: QrCodeDigitalMenuController;
  let fakeQrCodeService: Partial<QrCodeService>;

  beforeEach(async () => {
    fakeQrCodeService = {
      getQrCode: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [QrCodeDigitalMenuController],
      providers: [
        {
          provide: QrCodeService,
          useValue: fakeQrCodeService,
        },
      ],
    }).compile();

    controller = module.get<QrCodeDigitalMenuController>(
      QrCodeDigitalMenuController,
    );
  });

  it('should return ok', async () => {
    jest.spyOn(fakeQrCodeService, 'getQrCode').mockResolvedValue({
      qrCode: 'http://image.jpg',
      qrCodeWithBackground: 'http://image.jpg',
    });

    const response = await controller.get();

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw an exception', async (done) => {
    jest
      .spyOn(fakeQrCodeService, 'getQrCode')
      .mockRejectedValue(new Error('error'));

    try {
      await controller.get();
    } catch (error) {
      done();
    }
  });
});
