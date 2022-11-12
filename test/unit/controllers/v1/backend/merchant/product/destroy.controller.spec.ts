import { Test, TestingModule } from '@nestjs/testing';
import { ProductDestroyController } from '@controller/v1/backend/merchant/product/product-destroy.controller';
import { get } from 'lodash';
import { ProductService } from '@services/backend/merchant/product.service';

describe('ProductDestroyController', () => {
  let controller: ProductDestroyController;
  let productService: ProductService;
  let destroyMethod: jest.SpyInstance<Promise<void>, [id: number]>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ProductDestroyController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            destroy: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductDestroyController>(ProductDestroyController);
    productService = module.get<ProductService>(ProductService);
    destroyMethod = jest.spyOn(productService, 'destroy');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    destroyMethod.mockResolvedValue();

    const response = await controller.destroy(1);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(productService.destroy).toBeCalledWith(1);
  });

  it('throw exception', async (done) => {
    destroyMethod.mockRejectedValue(new Error('error'));

    try {
      await controller.destroy(1);
    } catch (error) {
      done();
    }
  });
});
