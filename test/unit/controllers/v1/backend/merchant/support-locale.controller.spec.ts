import { Test, TestingModule } from '@nestjs/testing';
import { SupportLocaleController } from '@controller/v1/backend/merchant/support-locale.controller';
import { SupportLocaleService } from '@services/backend/support-locale.service';
import { get } from 'lodash';

describe('SupportLocaleController', () => {
  let controller: SupportLocaleController;
  let fakeSupportLocaleService: Partial<SupportLocaleService>;

  beforeEach(async () => {
    fakeSupportLocaleService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupportLocaleController],
      providers: [
        {
          provide: SupportLocaleService,
          useValue: fakeSupportLocaleService,
        },
      ],
    }).compile();

    controller = module.get<SupportLocaleController>(SupportLocaleController);
  });

  it('should return ok', async () => {
    const response = await controller.getSupportLocales();

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw an exception', async (done) => {
    jest
      .spyOn(fakeSupportLocaleService, 'get')
      .mockRejectedValue(new Error('error'));

    try {
      await controller.getSupportLocales();
    } catch (error) {
      done();
    }
  });
});
