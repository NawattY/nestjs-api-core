import { Test, TestingModule } from '@nestjs/testing';
import { get } from 'lodash';
import { SettingGetController } from '@controller/v1/frontend/settings/setting-get.controller';
import { MerchantService } from '@services/frontend/merchant.service';

describe('SettingGetController', () => {
  let controller: SettingGetController;
  let service: MerchantService;
  const fakeRequest = {
    merchantId: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingGetController],
      providers: [
        {
          provide: MerchantService,
          useValue: {
            getSettings: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SettingGetController>(SettingGetController);
    service = module.get<MerchantService>(MerchantService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    const mockSetting = JSON.stringify({
      locale: 'th',
      logoImage: {
        original: 'https://test.com/test.jpg',
        thumbnail: 'https://test.com/thumbnail-test.jpg',
      },
      primaryColor: '#0e5863',
      secondaryColor: '#d18484',
      textOnPrimaryColor: '#ffffff',
      backgroundColor: '#fa2f14',
      supportLocales: ['th'],
    });

    jest.spyOn(service, 'getSettings').mockResolvedValue(mockSetting);

    const response = await controller.get(fakeRequest);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(get(response, 'data.locale')).toBeDefined();
  });

  it('throw exception', async (done) => {
    jest.spyOn(service, 'getSettings').mockRejectedValue(new Error('error'));

    try {
      await controller.get(fakeRequest);
    } catch (error) {
      done();
    }
  });
});
