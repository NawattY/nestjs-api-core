import { ProductEntity } from '@entities/tenant/products.entity';
import { BranchInactiveProductEntity } from '@entities/tenant/branch-inactive-products.entity';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { Inject, Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/config/app/config.service';
import { Brackets, Repository } from 'typeorm';
import { paginateRaw, Pagination } from 'nestjs-typeorm-paginate';
import { get, isEmpty } from 'lodash';
import { ProductException } from '@exceptions/app/product.exception';
import { BranchInactiveProductException } from '@exceptions/app/branch-inactive-product.exception';
import { BranchRecommendProductEntity } from '@entities/tenant/branch-recommend-products.entity';
import { BranchRecommendProductException } from '@exceptions/app/branch-recommend-product.exception';
import { GetParamsInterface } from '@interfaces/branch-product/get-params.interface';
import { UpdateStatusParamsInterface } from '@interfaces/branch-product/update-status-params.interface';

@Injectable()
export class BranchProductService {
  private productRepository: Repository<ProductEntity>;
  private branchInactiveProductRepository: Repository<BranchInactiveProductEntity>;
  private branchRecommendProductRepository: Repository<BranchRecommendProductEntity>;

  constructor(
    @Inject(MERCHANT_CONNECTION) connection,
    private appConfigService: AppConfigService,
  ) {
    this.productRepository = connection.getRepository(ProductEntity);
    this.branchInactiveProductRepository = connection.getRepository(
      BranchInactiveProductEntity,
    );
    this.branchRecommendProductRepository = connection.getRepository(
      BranchRecommendProductEntity,
    );
  }

  async get(
    branchId: number,
    parameters?: GetParamsInterface,
  ): Promise<Pagination<ProductEntity>> {
    const { filters } = parameters;

    const products = this.productRepository
      .createQueryBuilder('products')
      .select('products.*')
      .addSelect(
        `
      (
        CASE
          WHEN ( ( SELECT in_product.product_id FROM branch_inactive_products AS in_product WHERE in_product.product_id = products."id" AND in_product.branch_id = ${branchId} ) > 0 ) 
          THEN
            0 ELSE 1 
          END 
        ) AS status
      `,
      )
      .addSelect(
        `
        (
          CASE
            WHEN (
                (
                SELECT
                    in_product.product_id 
                FROM
                    branch_inactive_products AS in_product 
                WHERE
                    in_product.product_id = products."id" 
                    AND in_product.branch_id = ${branchId}
                    AND in_product.out_of_stock = 1 
                ) > 0 )
                THEN
                1 ELSE 0 
            END 
        ) AS out_of_stock 
        `,
      )
      .addSelect(
        `
        (
          CASE
            WHEN (
                (
                SELECT
                    product_recommend.product_id 
                FROM
                  branch_recommend_products AS product_recommend 
                WHERE
                    product_recommend.product_id = products."id" 
                    AND product_recommend.branch_id = ${branchId}
                ) > 0 )
                THEN
                1 ELSE 0 
            END 
        ) AS is_recommend 
        `,
      )
      .addSelect(
        `
        (
          CASE
            WHEN (
                (
                SELECT
                  branch_inactive_categories.category_id 
                FROM
                  branch_inactive_categories
                WHERE
                  branch_inactive_categories.category_id = products.category_id 
                  AND branch_inactive_categories.branch_id = ${branchId}
                ) > 0 )
                THEN
                0 ELSE 1 
            END 
        ) AS category_branch_is_active 
        `,
      )
      .leftJoin('products.category', 'category')
      .addSelect(['category.id', 'category.title'])
      .where('category.is_active = :isActive', { isActive: 1 })
      .andWhere('products.is_active = :isActive', { isActive: 1 })
      .orderBy('status', 'DESC')
      .addOrderBy('out_of_stock', 'DESC')
      .addOrderBy('products.updated_at', 'DESC')
      .addOrderBy('products.id', 'DESC');

    if (filters?.search) {
      products.andWhere(
        new Brackets((query) => {
          query.where(`LOWER(products.title->>'th') like :th`, {
            th: `%${filters.search.toLowerCase()}%`,
          });
          query.orWhere(`LOWER(products.title->>'en') like :en`, {
            en: `%${filters.search.toLowerCase()}%`,
          });
        }),
      );
    }

    if (filters?.categoryId) {
      products.andWhere('products.category_id = :categoryId', {
        categoryId: parameters.filters.categoryId,
      });
    }

    const page = get(parameters, 'page');
    const perPage = get(parameters, 'perPage');

    const options = {
      page: page ? page : 1,
      limit: perPage ? perPage : 30,
      route: `${this.appConfigService.url}/branch-products`,
    };

    return paginateRaw<ProductEntity>(products, options);
  }

  async findById(id: number, request: any) {
    const branchId = request.branchId;
    const response = this.productRepository
      .createQueryBuilder('products')
      .select('products.*')
      .where('products.id = :id', { id })
      .andWhere('products.isActive = 1')
      .leftJoin('products.category', 'category')
      .addSelect(['category.id', 'category.title'])
      .andWhere('category.isActive = 1')
      .addSelect(
        `CASE
          WHEN (
            SELECT
              in_product.product_id
            FROM branch_inactive_products AS in_product
            WHERE
              in_product.product_id = products."id"
              AND in_product.branch_id = ${branchId}
          ) > 0
          THEN 0 ELSE 1 
        END AS status`,
      )
      .addSelect(
        `CASE
          WHEN (
            SELECT
              branch_inactive_products.product_id 
            FROM
              branch_inactive_products
            WHERE
              branch_inactive_products.product_id = products."id" 
              AND branch_inactive_products.branch_id = ${branchId}
              AND branch_inactive_products.out_of_stock = 1 
            ) > 0
          THEN 1 ELSE 0 
        END AS out_of_stock`,
      )
      .addSelect(
        `CASE
          WHEN (
            SELECT
              branch_recommend_products.product_id 
            FROM
              branch_recommend_products 
            WHERE
              branch_recommend_products.product_id = products."id" 
              AND branch_recommend_products.branch_id = ${branchId}
            ) > 0
          THEN 1 ELSE 0 
        END AS is_recommend`,
      );

    const product = await response.getRawOne();

    if (!product) {
      throw ProductException.notFound();
    }

    return product;
  }

  async updateStatusAndRecommend(
    id: number,
    parameters: UpdateStatusParamsInterface,
  ) {
    const product = await this.productRepository.findOne(id);

    if (!product) {
      throw ProductException.notFound();
    }

    const branchInactiveProduct =
      await this.branchInactiveProductRepository.findOne({
        productId: id,
        branchId: parameters.branchId,
      });

    if (parameters.isActive && !isEmpty(branchInactiveProduct)) {
      try {
        await this.branchInactiveProductRepository.delete(
          branchInactiveProduct.id,
        );
      } catch (error) {
        throw BranchInactiveProductException.deleteError(error);
      }
    } else if (!parameters.isActive) {
      if (isEmpty(branchInactiveProduct)) {
        try {
          await this.branchInactiveProductRepository.save({
            productId: id,
            branchId: parameters.branchId,
            outOfStock: parameters.isOutOfStock,
          });
        } catch (error) {
          throw BranchInactiveProductException.createError(error);
        }
      } else {
        try {
          await this.branchInactiveProductRepository.update(
            branchInactiveProduct.id,
            {
              outOfStock: parameters.isOutOfStock,
            },
          );
        } catch (error) {
          throw BranchInactiveProductException.updateError(error);
        }
      }
    }

    if (parameters?.isRecommend || parameters.isRecommend === 0) {
      const branchRecommendProduct =
        await this.branchRecommendProductRepository.findOne({
          productId: id,
          branchId: parameters.branchId,
        });

      if (isEmpty(branchRecommendProduct) && parameters.isRecommend === 1) {
        try {
          await this.branchRecommendProductRepository.save({
            productId: id,
            branchId: parameters.branchId,
          });
        } catch (error) {
          throw BranchRecommendProductException.createError(error);
        }
      } else if (
        !isEmpty(branchRecommendProduct) &&
        parameters.isRecommend === 0
      ) {
        try {
          await this.branchRecommendProductRepository.delete(
            branchRecommendProduct.id,
          );
        } catch (error) {
          throw BranchRecommendProductException.deleteError(error);
        }
      }
    }
  }
}
