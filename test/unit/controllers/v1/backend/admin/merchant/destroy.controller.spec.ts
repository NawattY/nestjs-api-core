import { MerchantDestroyController } from '@controller/v1/backend/admin/merchant/merchant-destroy.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { MerchantService } from '@services/backend/admin/merchant.service';
import { MerchantEntity } from 'src/app/entities/default/merchant.entity';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';

describe('MerchantDestroyController', () => {
  let controller: MerchantDestroyController;
  let fakeMerchantService: Partial<MerchantService>;

  const merchant: MerchantEntity = plainToInstance(MerchantEntity, {
    id: 1,
  });

  beforeEach(async () => {
    fakeMerchantService = {
      destroy: () => Promise.resolve(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantDestroyController],
      providers: [
        {
          provide: MerchantService,
          useValue: fakeMerchantService,
        },
      ],
    }).compile();

    controller = module.get<MerchantDestroyController>(
      MerchantDestroyController,
    );
  });

  it('should return nothing', async () => {
    const response = await controller.destroy(merchant.id);

    expect(get(response, 'data')).toBeUndefined();
    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw exception', async (done) => {
    jest
      .spyOn(fakeMerchantService, 'destroy')
      .mockRejectedValue(new Error('error'));

    try {
      await controller.destroy(merchant.id);
    } catch (error) {
      done();
    }
  });
});
