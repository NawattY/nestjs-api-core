import { get } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { CategoryEntity } from '@entities/tenant/categories.entity';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { paginateRaw, Pagination } from 'nestjs-typeorm-paginate';
import { AppConfigService } from 'src/config/app/config.service';
import { isAppendOrInclude } from '@helpers/is-append-or-include.helper';
import { CategoryException } from '@exceptions/app/category.exception';
import { BranchInactiveCategoryEntity } from '@entities/tenant/branch-inactive-categories.entity';
import { BranchInactiveCategoryException } from '@exceptions/app/branch-inactive-category.exception';

@Injectable()
export class BranchCategoryService {
  private categoryRepository: Repository<CategoryEntity>;
  private branchInactiveCategoryRepository: Repository<BranchInactiveCategoryEntity>;

  constructor(
    @Inject(MERCHANT_CONNECTION) connection,
    private appConfigService: AppConfigService,
  ) {
    this.categoryRepository = connection.getRepository(CategoryEntity);
    this.branchInactiveCategoryRepository = connection.getRepository(
      BranchInactiveCategoryEntity,
    );
  }

  /**
   *
   * @param branchId
   * @param parameters
   * @returns
   */
  async get(
    branchId: number,
    parameters?: any,
  ): Promise<Pagination<CategoryEntity>> {
    const categories = this.categoryRepository
      .createQueryBuilder('categories')
      .where('categories.is_active = 1')
      .leftJoinAndSelect(
        'branch_inactive_categories',
        'inactive',
        'inactive.branch_id = :branchId AND inactive.category_id = categories.id',
        {
          branchId,
        },
      )
      .orderBy('inactive.branch_id', 'DESC')
      .addOrderBy('categories.ordinal')
      .addGroupBy('inactive.id');

    if (isAppendOrInclude(get(parameters, 'appends'), 'productCount')) {
      categories
        .innerJoin('categories.products', 'products')
        .andWhere('products.is_active = 1')
        .addSelect('COUNT(DISTINCT(products.id)) AS productCount');
    }

    categories.addGroupBy('categories.id');

    const filtersSearch = get(parameters, 'filters.search');

    if (filtersSearch) {
      categories.andWhere(
        new Brackets((query) => {
          query.where(`LOWER(categories.title->>'th') like :th`, {
            th: `%${filtersSearch.toLowerCase()}%`,
          });
          query.orWhere(`LOWER(categories.title->>'en') like :en`, {
            en: `%${filtersSearch.toLowerCase()}%`,
          });
        }),
      );
    }

    const page = get(parameters, 'page');
    const perPage = get(parameters, 'perPage');

    const options = {
      page: page ? page : 1,
      limit: perPage ? perPage : 30,
      route: `${this.appConfigService.url}/branch-categories`,
    };

    return paginateRaw<CategoryEntity>(categories, options);
  }

  /**
   *
   * @param id
   * @param branchId
   */
  async findById(id: number, branchId: number) {
    const category = await this.categoryRepository
      .createQueryBuilder('categories')
      .where('categories.id = :categoryId', { categoryId: id })
      .andWhere('categories.is_active = 1')
      .leftJoinAndSelect(
        'branch_inactive_categories',
        'inactive',
        'inactive.branch_id = :branchId AND inactive.category_id = categories.id',
        {
          branchId,
        },
      )
      .getRawOne();

    if (!category) {
      throw CategoryException.notFound();
    }

    return category;
  }

  /**
   *
   * @param id
   * @param parameters
   */
  async updateStatus(id: number, parameters?: any) {
    const branchInactiveCategory = await this.findById(id, parameters.branchId);
    if (parameters.isActive == 1) {
      try {
        await this.branchInactiveCategoryRepository.delete(
          branchInactiveCategory.inactive_id,
        );
      } catch (error) {
        throw BranchInactiveCategoryException.deleteError(error);
      }
    }

    if (parameters.isActive == 0) {
      try {
        await this.branchInactiveCategoryRepository.save({
          branchId: parameters.branchId,
          categoryId: id,
        });
      } catch (error) {
        throw BranchInactiveCategoryException.createError(error);
      }
    }
  }
}
