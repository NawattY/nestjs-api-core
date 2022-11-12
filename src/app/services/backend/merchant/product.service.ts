import { get } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { ProductEntity } from '@entities/tenant/products.entity';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { AppConfigService } from 'src/config/app/config.service';
import { ProductException } from '@exceptions/app/product.exception';
import { PATH_PRODUCT_IMAGE } from '@constants/path-upload';
import { CategoryEntity } from '@entities/tenant/categories.entity';
import { CategoryException } from '@exceptions/app/category.exception';
import { UploadFile } from '@helpers/upload-file.helper';
import { S3Service } from '@appotter/nestjs-s3';
import { isAppendOrInclude } from '@helpers/is-append-or-include.helper';

@Injectable()
export class ProductService {
  private productRepository: Repository<ProductEntity>;
  private categoryRepository: Repository<CategoryEntity>;

  constructor(
    @Inject(MERCHANT_CONNECTION) connection,
    private s3Service: S3Service,
    private appConfigService: AppConfigService,
    private uploadFile: UploadFile,
  ) {
    this.productRepository = connection.getRepository(ProductEntity);
    this.categoryRepository = connection.getRepository(CategoryEntity);
  }

  /**
   * @param parameters
   * @returns
   */
  async get(parameters?: any): Promise<Pagination<ProductEntity>> {
    const products = this.productRepository
      .createQueryBuilder('products')
      .orderBy('products.is_active', 'DESC')
      .addOrderBy('products.updated_at', 'DESC')
      .addOrderBy('products.id', 'DESC');

    const filtersSearch = parameters?.filters?.search;

    if (filtersSearch) {
      products.andWhere(
        new Brackets((query) => {
          query.where(`LOWER(products.title->>'th') like :th`, {
            th: `%${filtersSearch.toLowerCase()}%`,
          });
          query.orWhere(`LOWER(products.title->>'en') like :en`, {
            en: `%${filtersSearch.toLowerCase()}%`,
          });
        }),
      );
    }

    if (parameters?.filters?.categoryId) {
      products.andWhere('products.category_id = :categoryId', {
        categoryId: parameters.filters.categoryId,
      });
    }

    if (isAppendOrInclude(parameters?.include, 'category')) {
      products.leftJoinAndSelect('products.category', 'category');
    }

    const page = get(parameters, 'page');
    const perPage = get(parameters, 'perPage');

    const options = {
      page: page ? page : 1,
      limit: perPage ? perPage : 30,
      route: `${this.appConfigService.url}/products`,
    };

    return paginate<ProductEntity>(products, options);
  }

  /**
   * @param parameters
   * @returns
   */
  async store(parameters: any): Promise<ProductEntity> {
    const category = await this.categoryRepository.findOne(
      parameters.categoryId,
    );

    if (!category) {
      throw CategoryException.notFound();
    }

    const path = 'storage/product_default.png';
    const uploadImage = await this.uploadFile.uploadImage(
      path,
      PATH_PRODUCT_IMAGE,
      {
        image: parameters?.image,
        weight: 1000,
        height: 1000,
      },
    );

    parameters = Object.assign(parameters, {
      image: uploadImage,
    });

    try {
      return await this.productRepository.save({
        image: parameters.image,
        title: parameters.title,
        detail: parameters.detail,
        specialPrice: parameters.specialPrice,
        normalPrice: parameters.normalPrice,
        categoryId: parameters.categoryId,
        ordinal: parameters.ordinal,
        isActive: parameters.isActive,
      });
    } catch (error) {
      throw ProductException.createError(error);
    }
  }

  /**
   * @param id
   * @param parameters
   * @returns
   */
  async update(id: number, parameters: any) {
    const category = await this.categoryRepository.findOne(
      parameters.categoryId,
    );

    if (!category) {
      throw CategoryException.notFound();
    }

    const product = await this.findById(id);

    if (get(parameters, 'image') === '') {
      await this.s3Service.delete(product.image);
    }

    if (typeof parameters.image !== 'undefined') {
      const path = 'storage/product_default.png';
      const uploadImage = await this.uploadFile.uploadImage(
        path,
        PATH_PRODUCT_IMAGE,
        {
          image: parameters?.image,
          weight: 1000,
          height: 1000,
        },
      );

      parameters = Object.assign(parameters, {
        image: uploadImage,
      });
    }

    try {
      product.image = parameters.image ? parameters.image : product.image;
      product.title = parameters.title;
      product.detail = parameters.detail;
      product.specialPrice =
        parameters.specialPrice >= 0 ? parameters.specialPrice : null;
      product.normalPrice = parameters.normalPrice;
      product.categoryId = parameters.categoryId;
      product.ordinal = parameters.ordinal;
      product.isActive = parameters.isActive;

      return await this.productRepository.save(product);
    } catch (error) {
      throw ProductException.updateError(error);
    }
  }

  /**
   * @param id
   * @param parameters
   * @returns
   */
  async findById(id: number, parameters?: any): Promise<ProductEntity> {
    const productQuery = this.productRepository
      .createQueryBuilder('products')
      .where('products.id = :id', { id });

    if (isAppendOrInclude(parameters?.include, 'category')) {
      productQuery.leftJoinAndSelect('products.category', 'category');
    }

    const product = await productQuery.getOne();

    if (!product) {
      throw ProductException.notFound();
    }

    return product;
  }

  /**
   * @param id
   * @param isActive
   */
  async updateStatus(id: number, isActive: number): Promise<void> {
    await this.findById(id);

    try {
      await this.productRepository.update(id, {
        isActive,
      });
    } catch (error) {
      throw ProductException.updateError(error);
    }
  }

  /**
   * @param id
   */
  async destroy(id: number): Promise<void> {
    await this.findById(id);

    try {
      await this.productRepository.softDelete(id);
    } catch (error) {
      throw ProductException.deleteError(error);
    }
  }
}
