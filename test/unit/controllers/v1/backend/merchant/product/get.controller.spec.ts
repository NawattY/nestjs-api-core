import { ProductEntity } from '@entities/tenant/products.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductGetController } from '@controller/v1/backend/merchant/product/product-get.controller';
import { ProductService } from '@services/backend/merchant/product.service';
import { plainToInstance } from 'class-transformer';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { ProductResource } from '@resources/backend/merchant/product/product.resource';
import { get } from 'lodash';

describe('ProductGetController', () => {
  process.env.AWS_S3_URL = 'https://localhost.com';

  let controller: ProductGetController;
  let productService: ProductService;
  let getMethod:
    | jest.SpyInstance<
        Promise<Pagination<ProductEntity, IPaginationMeta>>,
        [parameters?: any]
      >
    | {
        (arg0: ProductResource, arg1: string): any;
        mockImplementation: (arg0: () => any) => void;
        mockRejectedValue: (arg0: Error) => void;
      };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ProductGetController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductGetController>(ProductGetController);
    productService = module.get<ProductService>(ProductService);
    getMethod = jest.spyOn(productService, 'get');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    getMethod.mockImplementation((): any => {
      const productA: ProductEntity = plainToInstance(ProductEntity, {
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

      const productB: ProductEntity = plainToInstance(ProductEntity, {
        id: 2,
        title: '{"th":"ผัดขี้เมา","en":"Pad khee mul"}',
        detail: '{"th":"สีเขียวสดใส หมาน่ารักมาก","en":"Color green"}',
        categoryId: 2,
        image: 'product/images/19f10171-895b-4558-afef-6fd7f001b3e9.png',
        isActive: 1,
        ordinal: 0,
        specialPrice: 0,
        normalPrice: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const productC: ProductEntity = plainToInstance(ProductEntity, {
        id: 3,
        title: '{"th":"ใบไม้ขึ้นหัวแล้วนะ3","en":"Test 3"}',
        detail: '{"th":"สีเขียวสดใส หมาน่ารักมาก","en":"Color green"}',
        categoryId: 3,
        image: 'product/images/19f10171-895b-4558-afef-6fd7f001b3e9.png',
        isActive: 1,
        ordinal: 2,
        specialPrice: 0,
        normalPrice: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      return Promise.resolve({
        items: [productA, productB, productC],
        meta: {
          totalItems: 3,
          itemCount: 3,
          itemsPerPage: 30,
          totalPages: 1,
          currentPage: 1,
        },
        links: {},
      } as Pagination<ProductEntity>);
    });

    const response = await controller.get(1);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(productService.get).toBeCalledWith(1);
  });

  it('throw exception', async (done) => {
    getMethod.mockRejectedValue(new Error('error'));

    try {
      await controller.get(1);
    } catch (error) {
      done();
    }
  });
});
