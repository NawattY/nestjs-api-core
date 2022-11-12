import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '@services/backend/merchant/product.service';
import { ProductEntity } from '@entities/tenant/products.entity';
import { ProductUpdateController } from '@controller/v1/backend/merchant/product/product-update.controller';
import { plainToInstance } from 'class-transformer';
import { ProductUpdateDto } from '@dtos/v1/backend/merchant/product/product-update.dto';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { get } from 'lodash';

describe('ProductUpdateController', () => {
  let controller: ProductUpdateController;
  let service: ProductService;
  let updateMethod: jest.SpyInstance<
    Promise<ProductEntity>,
    [id: number, parameters: ProductUpdateDto]
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NestjsFormDataModule],
      controllers: [ProductUpdateController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductUpdateController>(ProductUpdateController);
    service = module.get<ProductService>(ProductService);
    updateMethod = jest.spyOn(service, 'update');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('update should be ok', async () => {
    const productDto: ProductUpdateDto = plainToInstance(ProductUpdateDto, {
      title: '{"th":"ใบไม้ขึ้นหัวแล้วนะ","en":"Test 1"}',
      detail: '{"th":"สีเขียวสดใส หมาน่ารักมาก","en":"Color green"}',
      categoryId: 4,
      isActive: 1,
      ordinal: 2,
      specialPrice: 50,
      normalPrice: 100,
    });

    const mockProduct: ProductEntity = plainToInstance(ProductEntity, {
      id: 1,
      title: '{"th":"ใบไม้ขึ้นหัวแล้วนะ","en":"Test 1"}',
      detail: '{"th":"สีเขียวสดใส หมาน่ารักมาก","en":"Color green"}',
      categoryId: 4,
      isActive: 1,
      ordinal: 2,
      specialPrice: 0,
      normalPrice: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    updateMethod.mockResolvedValue(mockProduct);

    const response = await controller.update(1, productDto);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(get(response, 'data.id')).toEqual(mockProduct.id);
    expect(get(response, 'data.specialPrice')).toEqual(
      mockProduct.specialPrice,
    );
  });

  it('throw exception', async (done) => {
    const productDto: ProductUpdateDto = plainToInstance(ProductUpdateDto, {
      title: '{"th":"ใบไม้ขึ้นหัวแล้วนะ","en":"Test 1"}',
      detail: '{"th":"สีเขียวสดใส หมาน่ารักมาก","en":"Color green"}',
      categoryId: 4,
      isActive: 1,
      ordinal: 2,
      specialPrice: 0,
      normalPrice: 100,
    });

    updateMethod.mockRejectedValue(new Error('error'));

    try {
      await controller.update(1, productDto);
    } catch (error) {
      done();
    }
  });
});
