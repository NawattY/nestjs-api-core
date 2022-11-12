import { AccessMerchantController } from '@controller/v1/backend/admin/access-merchant.controller';
import { AccessMerchantDto } from '@dtos/v1/backend/admin/access-merchant.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { AdministratorService } from '@services/backend/admin/administrator.service';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';

describe('AccessMerchantController', () => {
  let controller: AccessMerchantController;
  let administratorService: AdministratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AccessMerchantController],
      providers: [
        {
          provide: AdministratorService,
          useValue: {
            accessMerchant: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccessMerchantController>(AccessMerchantController);
    administratorService =
      module.get<AdministratorService>(AdministratorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    const mockDto = plainToInstance(AccessMerchantDto, {
      merchantId: 1,
    });

    const responseService = { token: 'hashId' };

    jest
      .spyOn(administratorService, 'accessMerchant')
      .mockResolvedValue(responseService);

    const response = await controller.accessMerchant(mockDto);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(get(response, 'data.token')).toEqual(responseService.token);
  });

  it('throw exception', async (done) => {
    jest
      .spyOn(administratorService, 'accessMerchant')
      .mockRejectedValue(new Error('error'));

    const mockDto = plainToInstance(AccessMerchantDto, {
      merchantId: 1,
    });

    try {
      await controller.accessMerchant(mockDto);
    } catch (error) {
      done();
    }
  });
});
