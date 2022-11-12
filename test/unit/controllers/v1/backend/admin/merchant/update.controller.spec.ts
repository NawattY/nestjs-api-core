import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { MerchantUpdateController } from '@controller/v1/backend/admin/merchant/merchant-update.controller';
import { MerchantUpdateDto } from '@dtos/v1/backend/admin/merchant/update.dto';
import { MerchantService } from '@services/backend/admin/merchant.service';
import { MerchantEntity } from 'src/app/entities/default/merchant.entity';
import { get } from 'lodash';

const dto = {
  title: '{"en":"test 1"}',
  description: '{"en":"test 1"}',
  domain: 'test.com',
  name: 'test',
  email: 'test@test.com',
  password: 'password',
  mobile: '0899999999',
  connectionId: 1,
} as MerchantUpdateDto;

describe('MerchantUpdateController', () => {
  let controller: MerchantUpdateController;
  let fakeMerchantService: Partial<MerchantService>;

  const merchant: MerchantEntity = plainToInstance(MerchantEntity, {
    id: 1,
  });

  beforeEach(async () => {
    fakeMerchantService = {
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantUpdateController],
      providers: [
        {
          provide: MerchantService,
          useValue: fakeMerchantService,
        },
      ],
    }).compile();

    controller = module.get<MerchantUpdateController>(MerchantUpdateController);
  });

  it('should return ok', async () => {
    const response = await controller.update(merchant.id, dto);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw an exception', async (done) => {
    jest
      .spyOn(fakeMerchantService, 'update')
      .mockRejectedValue(new Error('error'));

    try {
      await controller.update(merchant.id, dto);
    } catch (error) {
      done();
    }
  });
});
