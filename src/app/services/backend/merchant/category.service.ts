import { get, isEmpty } from 'lodash';
import { CategoryUpdateDto } from '@dtos/v1/backend/merchant/category/category-update.dto';
import { CategoryStoreDto } from '@dtos/v1/backend/merchant/category/category-store.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { CategoryEntity } from '@entities/tenant/categories.entity';
import { ProductEntity } from '@entities/tenant/products.entity';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { CategoryException } from '@exceptions/app/category.exception';
import { paginateRaw, Pagination } from 'nestjs-typeorm-paginate';
import { AppConfigService } from 'src/config/app/config.service';
import { isAppendOrInclude } from '@helpers/is-append-or-include.helper';
import { UpdateOrdinalDto } from '@dtos/v1/backend/update-ordinal.dto';

@Injectable()
export class CategoryService {
  private categoryRepository: Repository<CategoryEntity>;
  private productRepository: Repository<ProductEntity>;

  constructor(
    @Inject(MERCHANT_CONNECTION) connection,
    private appConfigService: AppConfigService,
  ) {
    this.categoryRepository = connection.getRepository(CategoryEntity);
    this.productRepository = connection.getRepository(ProductEntity);
  }

  async get(parameters?: any): Promise<Pagination<CategoryEntity>> {
    const categories = this.categoryRepository
      .createQueryBuilder('categories')
      .orderBy('categories.ordinal', 'ASC')
      .addOrderBy('categories.id', 'DESC');

    if (isAppendOrInclude(parameters?.appends, 'productCount')) {
      categories
        .leftJoin('categories.products', 'products')
        .addSelect('COUNT(DISTINCT(products.id)) as productCount')
        .addGroupBy('categories.id');
    }

    const filtersSearch = parameters?.filters?.search;

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

    const page = get(parameters, 'page', 1);
    const perPage = get(parameters, 'perPage', 30);

    const options = {
      page: page,
      limit: perPage,
      route: `${this.appConfigService.url}/categories`,
    };

    return paginateRaw<CategoryEntity>(categories, options);
  }

  async store(categoryDto: CategoryStoreDto) {
    try {
      return await this.categoryRepository.save({
        title: JSON.parse(JSON.stringify(categoryDto.title)),
      });
    } catch (error) {
      throw CategoryException.createError(error);
    }
  }

  async findById(id: number, parameters?: any) {
    const categoryQuery = this.categoryRepository
      .createQueryBuilder('categories')
      .where('categories.id = :id', { id });

    if (isAppendOrInclude(parameters?.appends, 'productCount')) {
      categoryQuery.leftJoinAndSelect('categories.products', 'products');
    }

    const category = await categoryQuery.getOne();

    if (!category) {
      throw CategoryException.notFound();
    }

    return category;
  }

  async update(id: number, categoryDto: CategoryUpdateDto) {
    let isUpdated = false;

    try {
      const categoryUpdated = await this.categoryRepository
        .createQueryBuilder()
        .update(CategoryEntity)
        .set(categoryDto)
        .where('id = :id', { id })
        .execute();

      isUpdated = categoryUpdated.affected > 0;
    } catch (error) {
      throw CategoryException.updateError(error);
    }

    if (!isUpdated) {
      throw CategoryException.updateNotAffected();
    }

    return await this.findById(id);
  }

  async destroy(id: number) {
    await this.findById(id);
    const products = await this.productRepository.find({
      categoryId: id,
    });

    if (!isEmpty(products)) {
      throw CategoryException.deleteErrorAvailableProducts();
    }

    try {
      await this.categoryRepository.softDelete(id);
    } catch (error) {
      throw CategoryException.deleteError(error);
    }
  }

  async updateStatus(id: number, isActive: number) {
    await this.findById(id);

    try {
      await this.categoryRepository.update(id, {
        isActive,
      });
    } catch (error) {
      throw CategoryException.updateError(error);
    }
  }

  async updateOrdinal(dto: UpdateOrdinalDto): Promise<void> {
    try {
      const ordinalItems = dto.ordinal;

      for (const item of ordinalItems) {
        const id = parseInt(get(item, 'id'));
        const ordinal = parseInt(get(item, 'ordinal'));

        if (id && ordinal >= 0) {
          await this.categoryRepository.update(id, {
            ordinal: ordinal,
          });
        }
      }
    } catch (error) {
      throw CategoryException.updateError(error);
    }
  }
}
