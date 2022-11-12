import { Test, TestingModule } from '@nestjs/testing';
import { ProductUpdateStatusController } from '@controller/v1/backend/merchant/product/product-update-status.controller';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';
import { ProductService } from '@services/backend/merchant/product.service';
import { UpdateStatusDto } from '@dtos/v1/backend/update-status.dto';

describe('ProductUpdateStatusController', () => {
  let controller: ProductUpdateStatusController;
  let productService: ProductService;
  let updateStatusMethod: jest.SpyInstance<
    Promise<void>,
    [id: number, isActive: number]
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ProductUpdateStatusController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            updateStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductUpdateStatusController>(
      ProductUpdateStatusController,
    );
    productService = module.get<ProductService>(ProductService);
    updateStatusMethod = jest.spyOn(productService, 'updateStatus');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    const mockDto = plainToInstance(UpdateStatusDto, {
      isActive: 1,
    });

    updateStatusMethod.mockResolvedValue();

    const response = await controller.updateStatus(1, mockDto);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(productService.updateStatus).toBeCalledWith(1, 1);
  });

  it('throw exception', async (done) => {
    updateStatusMethod.mockRejectedValue(new Error('error'));

    const mockDto = plainToInstance(UpdateStatusDto, {
      isActive: 1,
    });

    try {
      await controller.updateStatus(1, mockDto);
    } catch (error) {
      done();
    }
  });
});
