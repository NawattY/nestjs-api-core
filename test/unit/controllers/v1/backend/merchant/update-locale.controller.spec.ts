import { UpdateLocaleController } from '@controller/v1/backend/merchant/update-locale.controller';
import { UpdateLocaleDto } from '@dtos/v1/backend/merchant/update-locale.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { MerchantService } from '@services/backend/admin/merchant.service';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';

describe('UpdateLocaleController', () => {
  let controller: UpdateLocaleController;
  let merchantService: MerchantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UpdateLocaleController],
      providers: [
        {
          provide: MerchantService,
          useValue: {
            updateLocale: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UpdateLocaleController>(UpdateLocaleController);
    merchantService = module.get<MerchantService>(MerchantService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    const mockDto = plainToInstance(UpdateLocaleDto, {
      supportLocales: ['th', 'en'],
      locale: 'th',
    });

    jest.spyOn(merchantService, 'updateLocale').mockResolvedValue();

    const response = await controller.update(mockDto);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw exception', async (done) => {
    jest
      .spyOn(merchantService, 'updateLocale')
      .mockRejectedValue(new Error('error'));

    const mockDto = plainToInstance(UpdateLocaleDto, {
      supportLocales: ['th', 'en'],
      locale: 'th',
    });

    try {
      await controller.update(mockDto);
    } catch (error) {
      done();
    }
  });
});
