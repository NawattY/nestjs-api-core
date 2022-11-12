import { Test, TestingModule } from '@nestjs/testing';
import { MerchantStoreController } from '@controller/v1/backend/admin/merchant/merchant-store.controller';
import { MerchantStoreDto } from '@dtos/v1/backend/admin/merchant/merchant-store.dto';
import { MerchantService } from '@services/backend/admin/merchant.service';

const dto = {
  title: '{"en":"test 1"}',
  description: '{"en":"test 1"}',
  domain: 'test.com',
  name: 'test',
  email: 'test@test.com',
  password: 'password',
  mobile: '0899999999',
  connectionId: 1,
} as MerchantStoreDto;

describe('MerchantStoreController', () => {
  let controller: MerchantStoreController;
  let fakeMerchantService: Partial<MerchantService>;

  beforeEach(async () => {
    fakeMerchantService = {
      store: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantStoreController],
      providers: [
        {
          provide: MerchantService,
          useValue: fakeMerchantService,
        },
      ],
    }).compile();

    controller = module.get<MerchantStoreController>(MerchantStoreController);
  });

  it('should return ok', async () => {
    const addUser = await controller.store(dto);

    expect(addUser.status.code).toEqual(200);
    expect(addUser.status.message).toEqual('OK');
  });

  it('throw an exception', async (done) => {
    jest
      .spyOn(fakeMerchantService, 'store')
      .mockRejectedValue(new Error('error'));

    try {
      await controller.store(dto);
    } catch (error) {
      done();
    }
  });
});
