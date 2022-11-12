import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { MerchantGetByIdController } from '@controller/v1/backend/admin/merchant/merchant-show.controller';
import { MerchantService } from '@services/backend/admin/merchant.service';
import { MerchantEntity } from 'src/app/entities/default/merchant.entity';
import { get } from 'lodash';

describe('MerchantGetByIdController', () => {
  let controller: MerchantGetByIdController;
  let fakeMerchantService: Partial<MerchantService>;

  const merchant: MerchantEntity = plainToInstance(MerchantEntity, {
    id: 1,
  });

  beforeEach(async () => {
    fakeMerchantService = {
      findById: (id: number) => {
        const merchant: MerchantEntity = plainToInstance(MerchantEntity, {
          id: id,
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
      controllers: [MerchantGetByIdController],
      providers: [
        {
          provide: MerchantService,
          useValue: fakeMerchantService,
        },
      ],
    }).compile();

    controller = module.get<MerchantGetByIdController>(
      MerchantGetByIdController,
    );
  });

  it('should return ok', async () => {
    const response = await controller.show(merchant.id);

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
