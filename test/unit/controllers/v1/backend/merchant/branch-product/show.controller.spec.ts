import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';
import { BranchProductShowController } from '@controller/v1/backend/merchant/branch-product/branch-product-show.controller';
import { BranchProductService } from '@services/backend/branch-product.service';
import { ProductEntity } from '@entities/tenant/products.entity';
import { BranchEntity } from '@entities/tenant/branch.entity';

describe('BranchProductShowController', () => {
  let controller: BranchProductShowController;
  let fakeBranchProductService: Partial<BranchProductService>;

  const branch: BranchEntity = plainToInstance(BranchEntity, {
    id: 1,
  });

  const branchProduct: ProductEntity = plainToInstance(ProductEntity, {
    id: 1,
  });

  beforeEach(async () => {
    fakeBranchProductService = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchProductShowController],
      providers: [
        {
          provide: BranchProductService,
          useValue: fakeBranchProductService,
        },
      ],
    }).compile();

    controller = module.get<BranchProductShowController>(
      BranchProductShowController,
    );
  });

  it('should return ok', async () => {
    jest
      .spyOn(fakeBranchProductService, 'findById')
      .mockResolvedValue(branchProduct);

    const response = await controller.show(branchProduct.id, {
      branchId: branch.id,
    });

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw an exception', async (done) => {
    jest
      .spyOn(fakeBranchProductService, 'findById')
      .mockRejectedValue(new Error('error'));

    try {
      await controller.show(branchProduct.id, { branchId: branch.id });
    } catch (error) {
      done();
    }
  });
});
