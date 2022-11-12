import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '@services/backend/merchant/product.service';
import { ProductEntity } from '@entities/tenant/products.entity';
import { ProductStoreController } from '@controller/v1/backend/merchant/product/product-store.controller';
import { plainToInstance } from 'class-transformer';
import { ProductStoreDto } from '@dtos/v1/backend/merchant/product/product-store.dto';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { get } from 'lodash';

describe('ProductStoreController', () => {
  let controller: ProductStoreController;
  let service: ProductService;
  let storeMethod: jest.SpyInstance<
    Promise<ProductEntity>,
    [parameters: ProductStoreDto]
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NestjsFormDataModule],
      controllers: [ProductStoreController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            store: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductStoreController>(ProductStoreController);
    service = module.get<ProductService>(ProductService);
    storeMethod = jest.spyOn(service, 'store');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('store should be ok', async () => {
    const productDto: ProductStoreDto = plainToInstance(ProductStoreDto, {
      title: '{"th":"ใบไม้ขึ้นหัวแล้วนะ","en":"Test 1"}',
      detail: '{"th":"สีเขียวสดใส หมาน่ารักมาก","en":"Color green"}',
      categoryId: 4,
      isActive: 1,
      ordinal: 2,
      specialPrice: 0,
      normalPrice: 100,
    });

    const storeProduct: ProductEntity = plainToInstance(ProductEntity, {
      id: 1,
      title: '{"th":"ใบไม้ขึ้นหัวแล้วนะ","en":"Test 1"}',
      detail: '{"th":"สีเขียวสดใส หมาน่ารักมาก","en":"Color green"}',
      categoryId: 4,
      image: null,
      isActive: 1,
      ordinal: 2,
      specialPrice: 0,
      normalPrice: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    storeMethod.mockResolvedValue(storeProduct);

    const response = await controller.store(productDto);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(get(response, 'data.id')).toEqual(storeProduct.id);
  });

  it('throw exception', async (done) => {
    const productDto: ProductStoreDto = plainToInstance(ProductStoreDto, {
      title: '{"th":"ใบไม้ขึ้นหัวแล้วนะ","en":"Test 1"}',
      detail: '{"th":"สีเขียวสดใส หมาน่ารักมาก","en":"Color green"}',
      categoryId: 4,
      isActive: 1,
      ordinal: 2,
      specialPrice: 0,
      normalPrice: 100,
    });

    storeMethod.mockRejectedValue(new Error('error'));

    try {
      await controller.store(productDto);
    } catch (error) {
      done();
    }
  });
});
