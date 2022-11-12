import { ProductEntity } from '@entities/tenant/products.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductShowController } from '@controller/v1/backend/merchant/product/product-show.controller';
import { ProductService } from '@services/backend/merchant/product.service';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';

describe('ProductShowController', () => {
  process.env.AWS_S3_URL = 'https://localhost.com';

  let controller: ProductShowController;
  let productService: ProductService;
  let findByIdMethod: jest.SpyInstance<
    Promise<ProductEntity>,
    [id: number, parameters?: any]
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ProductShowController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductShowController>(ProductShowController);
    productService = module.get<ProductService>(ProductService);
    findByIdMethod = jest.spyOn(productService, 'findById');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    const product: ProductEntity = plainToInstance(ProductEntity, {
      id: 1,
      title: '{"th":"ใบไม้ขึ้นหัวแล้วนะ","en":"Test 1"}',
      detail: '{"th":"สีเขียวสดใส หมาน่ารักมาก","en":"Color green"}',
      categoryId: 4,
      image: 'product/images/19f10171-895b-4558-afef-6fd7f001b3e9.png',
      isActive: 1,
      ordinal: 2,
      specialPrice: 0,
      normalPrice: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    findByIdMethod.mockResolvedValue(product);

    const response = await controller.show(1, {});

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(get(response, 'data.id')).toEqual(product.id);
  });

  it('throw exception', async (done) => {
    findByIdMethod.mockRejectedValue(new Error('error'));

    try {
      await controller.show(1, {});
    } catch (error) {
      done();
    }
  });
});
