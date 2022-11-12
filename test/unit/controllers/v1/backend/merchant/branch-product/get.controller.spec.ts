import { BranchProductGetController } from '@controller/v1/backend/merchant/branch-product/branch-product-get.controller';
import { plainToInstance } from 'class-transformer';
import { Test, TestingModule } from '@nestjs/testing';
import { Pagination } from 'nestjs-typeorm-paginate';
import { BranchProductService } from '@services/backend/branch-product.service';
import { ProductEntity } from '@entities/tenant/products.entity';
import { BranchEntity } from '@entities/tenant/branch.entity';
import { get } from 'lodash';

describe('BranchProductGetController', () => {
  let controller: BranchProductGetController;
  let fakeBranchProductService: Partial<BranchProductService>;
  const branch: BranchEntity = plainToInstance(BranchEntity, {
    id: 1,
    title: '{"th":"test"}',
    detail: '{"th":"test"}',
    phone: '0899999999',
    isActive: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ProductEntity,
  });

  beforeEach(async () => {
    fakeBranchProductService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchProductGetController],
      providers: [
        {
          provide: BranchProductService,
          useValue: fakeBranchProductService,
        },
      ],
    }).compile();

    controller = module.get<BranchProductGetController>(
      BranchProductGetController,
    );
  });

  it('should return data with paginate', async () => {
    jest.spyOn(fakeBranchProductService, 'get').mockImplementation((): any => {
      const productA: ProductEntity = plainToInstance(ProductEntity, {
        id: 1,
        title: '{"th":"test"}',
        detail: '{"th":"test"}',
        normalPrice: '120',
        specialPrice: '100',
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
      const productB: ProductEntity = plainToInstance(ProductEntity, {
        id: 2,
        title: '{"th":"test 2"}',
        detail: '{"th":"test"}',
        normalPrice: '120',
        specialPrice: '100',
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
      const productC: ProductEntity = plainToInstance(ProductEntity, {
        id: 3,
        title: '{"th":"test 3"}',
        detail: '{"th":"test"}',
        normalPrice: '120',
        specialPrice: '100',
        isActive: 1,
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

    const response = await controller.get(
      { branchId: branch.id },
      {
        page: 1,
        perPage: 30,
      },
    );

    expect(get(response, 'data').length).toEqual(3);
    expect(get(response, 'meta')).toBeDefined();
  });

  it('throw an exception', async (done) => {
    jest
      .spyOn(fakeBranchProductService, 'get')
      .mockRejectedValue(new Error('error'));

    try {
      await controller.get(
        { branchId: branch.id },
        {
          page: 1,
          perPage: 30,
        },
      );
    } catch (error) {
      done();
    }
  });
});
