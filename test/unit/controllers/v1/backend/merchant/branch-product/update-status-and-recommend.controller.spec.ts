import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';
import { BranchProductUpdateStatusAndRecommendController } from '@controller/v1/backend/merchant/branch-product/branch-product-update-status-and-recommend.controller';
import { BranchProductService } from '@services/backend/branch-product.service';
import { ProductEntity } from '@entities/tenant/products.entity';
import { BranchEntity } from '@entities/tenant/branch.entity';
import { UpdateIsActiveAndRecommendDto } from '@dtos/v1/backend/branch-product/update-isactive-and-recommend.dto';

const dto = {
  isActive: 1,
  isOutOfStock: 0,
  isRecommend: 0,
} as UpdateIsActiveAndRecommendDto;

describe('BranchProductUpdateStatusAndRecommendController', () => {
  let controller: BranchProductUpdateStatusAndRecommendController;
  let fakeBranchProductService: Partial<BranchProductService>;

  const branch: BranchEntity = plainToInstance(BranchEntity, {
    id: 1,
  });

  const branchProduct: ProductEntity = plainToInstance(ProductEntity, {
    id: 1,
  });

  beforeEach(async () => {
    fakeBranchProductService = {
      updateStatusAndRecommend: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchProductUpdateStatusAndRecommendController],
      providers: [
        {
          provide: BranchProductService,
          useValue: fakeBranchProductService,
        },
      ],
    }).compile();

    controller = module.get<BranchProductUpdateStatusAndRecommendController>(
      BranchProductUpdateStatusAndRecommendController,
    );
  });

  it('should return ok', async () => {
    jest
      .spyOn(fakeBranchProductService, 'updateStatusAndRecommend')
      .mockResolvedValue();

    const response = await controller.updateStatusAndRecommend(
      branchProduct.id,
      { branchId: branch.id },
      dto,
    );

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw an exception', async (done) => {
    jest
      .spyOn(fakeBranchProductService, 'updateStatusAndRecommend')
      .mockRejectedValue(new Error('error'));

    try {
      await controller.updateStatusAndRecommend(
        branchProduct.id,
        { branchId: branch.id },
        dto,
      );
    } catch (error) {
      done();
    }
  });
});
