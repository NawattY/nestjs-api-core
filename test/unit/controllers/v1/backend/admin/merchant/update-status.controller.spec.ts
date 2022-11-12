import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { MerchantUpdateStatusController } from '@controller/v1/backend/admin/merchant/merchant-update-status.controller';
import { UpdateStatusDto } from '@dtos/v1/backend/update-status.dto';
import { MerchantService } from '@services/backend/admin/merchant.service';
import { MerchantEntity } from 'src/app/entities/default/merchant.entity';
import { get } from 'lodash';

const dto = {
  isActive: 1,
} as UpdateStatusDto;

describe('MerchantUpdateStatusController', () => {
  let controller: MerchantUpdateStatusController;
  let fakeMerchantService: Partial<MerchantService>;

  const merchant: MerchantEntity = plainToInstance(MerchantEntity, {
    id: 1,
  });

  beforeEach(async () => {
    fakeMerchantService = {
      updateStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantUpdateStatusController],
      providers: [
        {
          provide: MerchantService,
          useValue: fakeMerchantService,
        },
      ],
    }).compile();

    controller = module.get<MerchantUpdateStatusController>(
      MerchantUpdateStatusController,
    );
  });

  it('should return ok', async () => {
    const response = await controller.updateStatus(merchant.id, dto);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw an exception', async (done) => {
    jest
      .spyOn(fakeMerchantService, 'updateStatus')
      .mockRejectedValue(new Error('error'));

    try {
      await controller.updateStatus(merchant.id, dto);
    } catch (error) {
      done();
    }
  });
});
