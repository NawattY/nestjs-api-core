import { Inject, Injectable } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { ProductEntity } from '@entities/tenant/products.entity';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { ProductException } from '@exceptions/app/product.exception';
import { chain, isEmpty } from 'lodash';
import { CategoryEntity } from '@entities/tenant/categories.entity';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ProductService {
  private productRepository: Repository<ProductEntity>;
  private categoryRepository: Repository<CategoryEntity>;

  constructor(
    @Inject(MERCHANT_CONNECTION) connection,
    private readonly i18n: I18nService,
  ) {
    this.productRepository = connection.getRepository(ProductEntity);
    this.categoryRepository = connection.getRepository(CategoryEntity);
  }

  private async getProductCategoryRecommend(request: any): Promise<any> {
    const branchId = request.branchId;

    const query = this.categoryRepository
      .createQueryBuilder('categories')
      .leftJoinAndSelect('categories.products', 'products')
      .leftJoinAndSelect(
        'products.branchInactiveProducts',
        'branchInactiveProducts',
        'branchInactiveProducts.branch_id = :branchId',
        {
          branchId,
        },
      )
      .leftJoinAndSelect(
        'products.branchRecommendProducts',
        'branchRecommendProducts',
      )
      .leftJoinAndSelect(
        'categories.branchInactiveCategories',
        'branchInactiveCategories',
        'branchInactiveCategories.branch_id = :branchId',
        {
          branchId,
        },
      )
      .where('categories.is_active = 1')
      .andWhere('products.is_active = 1')
      .andWhere('branchRecommendProducts.id is not null')
      .addOrderBy('products.updated_at', 'DESC');

    query.andWhere(
      new Brackets((q) => {
        q.where('branchInactiveProducts.out_of_stock is null')
          .orWhere('branchInactiveProducts.out_of_stock = 1')
          .orWhere(`branchInactiveProducts.branch_id != ${branchId}`);
      }),
    );

    query.andWhere(
      new Brackets((q) => {
        q.where(`branchInactiveCategories.branch_id is null`).orWhere(
          `branchInactiveCategories.branch_id != ${branchId}`,
        );
      }),
    );

    const productCategoryRecommend = await query.getRawMany();

    const groupProducts = chain(productCategoryRecommend)
      .groupBy('branchRecommendProducts_branch_id')
      .map((value: any) => ({
        data: value,
      }))
      .value();

    if (groupProducts.length > 0) {
      const data = groupProducts[0]['data'];

      const uniqueValues = data.filter(
        (value: { products_id: number }, index: number) =>
          data.findIndex(
            (product: { products_id: number }) =>
              value.products_id === product.products_id,
          ) === index,
      );

      return [
        {
          id: 0,
          title: this.i18n.t(`service.product_recommend_group_title`, {
            lang: request.locale,
          }),
          products: uniqueValues,
        },
      ];
    } else {
      return [];
    }
  }

  async get(request: any): Promise<any> {
    const branchId = request.branchId;

    const productCategoryRecommend = await this.getProductCategoryRecommend(
      request,
    );

    const query = this.categoryRepository
      .createQueryBuilder('categories')
      .leftJoinAndSelect('categories.products', 'products')
      .leftJoinAndSelect(
        'products.branchInactiveProducts',
        'branchInactiveProducts',
        'branchInactiveProducts.branch_id = :branchId',
        {
          branchId,
        },
      )
      .leftJoinAndSelect(
        'categories.branchInactiveCategories',
        'branchInactiveCategories',
        'branchInactiveCategories.branch_id = :branchId',
        {
          branchId,
        },
      )
      .where('categories.is_active = 1')
      .andWhere('products.is_active = 1')
      .addOrderBy('products.updated_at', 'DESC');

    query.andWhere(
      new Brackets((q) => {
        q.where('branchInactiveProducts.out_of_stock is null')
          .orWhere('branchInactiveProducts.out_of_stock = 1')
          .orWhere(`branchInactiveProducts.branch_id != ${branchId}`);
      }),
    );

    query.andWhere(
      new Brackets((q) => {
        q.where(`branchInactiveCategories.branch_id is null`).orWhere(
          `branchInactiveCategories.branch_id != ${branchId}`,
        );
      }),
    );

    const response = await query.getRawMany();

    const groupProducts = chain(response)
      .groupBy('categories_id')
      .map((value: any) => ({
        data: value,
      }))
      .sortBy('data.0.categories_ordinal')
      .value();

    let productCategories = [];

    if (groupProducts.length > 0) {
      productCategories = groupProducts.map((value, index) => {
        const data = groupProducts[index]['data'];

        const uniqueValues = data.filter(
          (value: { products_id: number }, index: number) =>
            data.findIndex(
              (product: { products_id: number }) =>
                value.products_id === product.products_id,
            ) === index,
        );

        return {
          id: value['data'][0]['categories_id'],
          title: value['data'][0]['categories_title'],
          categoryOrdinal: value['data'][0]['categories_ordinal'],
          products: uniqueValues,
        };
      });
    }

    return [...productCategoryRecommend, ...productCategories];
  }

  async findById(id: number, request: any): Promise<ProductEntity> {
    const branchId = request.branchId;

    const query = this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect(
        'products.branchInactiveProducts',
        'branchInactiveProducts',
        'branchInactiveProducts.branch_id = :branchId',
        {
          branchId,
        },
      )
      .leftJoinAndSelect(
        'category.branchInactiveCategories',
        'branchInactiveCategories',
        'branchInactiveCategories.branch_id = :branchId',
        {
          branchId,
        },
      )
      .where('products.id = :id', { id })
      .andWhere('products.isActive = 1')
      .andWhere('category.isActive = 1');

    query.andWhere(
      new Brackets((q) => {
        q.where('branchInactiveProducts.out_of_stock is null')
          .orWhere('branchInactiveProducts.out_of_stock = 1')
          .orWhere(`branchInactiveProducts.branch_id != ${branchId}`);
      }),
    );

    const product = await query.getOne();

    if (
      isEmpty(product) ||
      !isEmpty(product.category?.branchInactiveCategories)
    ) {
      throw ProductException.notFound();
    }

    return product;
  }
}
