import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { ProductService } from '@services/frontend/product.service';
import { I18nService } from 'nestjs-i18n';

const productCategoryRecommend = [
  {
    categories_id: '1',
    categories_title: '{ "th":"หมวดหมู่ 1", "en":"category 1" }',
    categories_is_active: 1,
    categories_ordinal: 1,
    categories_created_at: new Date(),
    categories_updated_at: new Date(),
    categories_deleted_at: null,
    products_id: '1',
    products_title: '{ "th":"สินค้า 1", "en":"product 1" }',
    products_detail: '{ "th":"รายละเอียด 1", "en":"detail 1" }',
    products_normal_price: '100.0000',
    products_special_price: null,
    products_category_id: 1,
    products_image: 'product/images/product1.png',
    products_is_active: 1,
    products_ordinal: 0,
    products_created_at: new Date(),
    products_updated_at: new Date(),
    products_deleted_at: null,
    branchInactiveProducts_id: null,
    branchInactiveProducts_product_id: null,
    branchInactiveProducts_branch_id: null,
    branchInactiveProducts_out_of_stock: null,
    branchRecommendProducts_id: '1',
    branchRecommendProducts_product_id: '1',
    branchRecommendProducts_branch_id: '1',
    branchInactiveCategories_id: null,
    branchInactiveCategories_category_id: null,
    branchInactiveCategories_branch_id: null,
  },
];

const productAll = [
  {
    categories_id: '2',
    categories_title: '{ "th":"หมวดหมู่ 2", "en":"category 2" }',
    categories_is_active: 1,
    categories_ordinal: 3,
    categories_created_at: new Date(),
    categories_updated_at: new Date(),
    categories_deleted_at: null,
    products_id: '10',
    products_title: '{ "th":"สินค้า 10", "en":"product 10" }',
    products_detail: '{ "th":"รายละเอียด 10", "en":"detail 10" }',
    products_normal_price: '0.0000',
    products_special_price: null,
    products_category_id: 2,
    products_image: 'product/images/product10.png',
    products_is_active: 1,
    products_ordinal: 0,
    products_created_at: new Date(),
    products_updated_at: new Date(),
    products_deleted_at: null,
    branchInactiveProducts_id: null,
    branchInactiveProducts_product_id: null,
    branchInactiveProducts_branch_id: null,
    branchInactiveProducts_out_of_stock: null,
    branchInactiveCategories_id: null,
    branchInactiveCategories_category_id: null,
    branchInactiveCategories_branch_id: null,
  },
  {
    categories_id: '2',
    categories_title: '{ "th":"หมวดหมู่ 2", "en":"category 2" }',
    categories_is_active: 1,
    categories_ordinal: 3,
    categories_created_at: new Date(),
    categories_updated_at: new Date(),
    categories_deleted_at: null,
    products_id: '9',
    products_title: '{ "th":"สินค้า 9", "en":"product 9" }',
    products_detail: '{ "th":"รายละเอียด 9", "en":"detail 9" }',
    products_normal_price: '0.0000',
    products_special_price: null,
    products_category_id: 2,
    products_image: 'product/images/product9.png',
    products_is_active: 1,
    products_ordinal: 0,
    products_created_at: new Date(),
    products_updated_at: new Date(),
    products_deleted_at: null,
    branchInactiveProducts_id: null,
    branchInactiveProducts_product_id: null,
    branchInactiveProducts_branch_id: null,
    branchInactiveProducts_out_of_stock: null,
    branchInactiveCategories_id: null,
    branchInactiveCategories_category_id: null,
    branchInactiveCategories_branch_id: null,
  },
];

describe('ProductService -> get', () => {
  const sharedTestProviders = [
    ProductService,
    {
      provide: I18nService,
      useValue: {
        t: jest.fn().mockReturnValue('Recommended'),
      },
    },
  ];

  let service: ProductService;
  let fakeMerchantConnection: Partial<Connection>;

  beforeEach(async () => {
    fakeMerchantConnection = {
      getRepository: jest.fn(),
    };
  });

  it('should be ok', async () => {
    // mock getRepository(ProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
        };
      });

    // mock getRepository(CategoryEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        const mockGetRawMany = jest
          .fn()
          .mockResolvedValueOnce(productCategoryRecommend)
          .mockResolvedValueOnce(productAll);

        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
            getRawMany: mockGetRawMany,
          })),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        ...sharedTestProviders,
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);

    const params = {
      branchId: 1,
      locale: 'en',
    };

    const result = await service.get(params);

    // expect(result[0].id).toEqual(0);
    expect(result.length).toEqual(2);
  });

  it('should be ok is empty product recommend', async () => {
    // mock getRepository(ProductEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
        };
      });

    // mock getRepository(CategoryEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        const mockGetRawMany = jest
          .fn()
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce(productAll);

        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
            getRawMany: mockGetRawMany,
          })),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        ...sharedTestProviders,
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);

    const params = {
      branchId: 1,
      locale: 'en',
    };

    const result = await service.get(params);

    expect(result.length).toEqual(1);
  });
});
