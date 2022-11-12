import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { MerchantInformationController } from '@controller/v1/backend/merchant/merchant-information.controller';
import { MerchantService } from '@services/backend/admin/merchant.service';
import { MerchantEntity } from 'src/app/entities/default/merchant.entity';
import { get } from 'lodash';

describe('MerchantInformationController', () => {
  let controller: MerchantInformationController;
  let fakeMerchantService: Partial<MerchantService>;

  const merchant: MerchantEntity = plainToInstance(MerchantEntity, {
    id: 1,
  });

  beforeEach(async () => {
    fakeMerchantService = {
      findById: () => {
        const merchant: MerchantEntity = plainToInstance(MerchantEntity, {
          id: 1,
          title: '{"en":"test 1"}',
          description: '{"en":"test 1"}',
          settings: '{ "test": "test" }',
          domain: 'test1.com',
          isActive: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        });

        return Promise.resolve(merchant);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantInformationController],
      providers: [
        {
          provide: MerchantService,
          useValue: fakeMerchantService,
        },
      ],
    }).compile();

    controller = module.get<MerchantInformationController>(
      MerchantInformationController,
    );
  });

  it('should return ok', async () => {
    const response = await controller.show(1);

    expect(get(response, 'data.id')).toEqual(merchant.id);
    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw an exception', async (done) => {
    jest
      .spyOn(fakeMerchantService, 'findById')
      .mockRejectedValue(new Error('error'));

    try {
      await controller.show(merchant.id);
    } catch (error) {
      done();
    }
  });
});
