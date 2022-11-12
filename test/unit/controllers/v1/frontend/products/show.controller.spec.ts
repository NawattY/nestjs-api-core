import { Test, TestingModule } from '@nestjs/testing';
import { get } from 'lodash';
import { ProductService } from '@services/frontend/product.service';
import { ProductShowController } from '@controller/v1/frontend/products/product-show.controller';
import { ProductEntity } from '@entities/tenant/products.entity';
import { plainToInstance } from 'class-transformer';

describe('ProductShowController', () => {
  process.env.AWS_S3_URL = 'https://test.com';

  let controller: ProductShowController;
  let service: ProductService;
  const fakeRequest = {
    branchId: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    const mockProduct: ProductEntity = plainToInstance(ProductEntity, {
      id: 1,
      title: { th: 'ชาดำ', en: 'ชาดำ' },
      detail: { th: 'ชาดำ', en: 'ชาดำ' },
      normalPrice: '90.0000',
      specialPrice: null,
      categoryId: 1,
      image: 'image.jpg',
      isActive: 1,
      ordinal: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      category: {
        id: '59',
        title: { th: 'ชา', en: 'Tea' },
        isActive: 1,
        ordinal: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    });

    jest.spyOn(service, 'findById').mockResolvedValue(mockProduct);

    const response = await controller.show(1, fakeRequest);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(get(response, 'data.id')).toEqual(mockProduct.id);
  });

  it('throw exception', async (done) => {
    jest.spyOn(service, 'findById').mockRejectedValue(new Error('error'));

    try {
      await controller.show(1, fakeRequest);
    } catch (error) {
      done();
    }
  });
});
