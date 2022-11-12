import { Inject, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { BannerEntity } from '@entities/tenant/banner.entity';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { UploadFile } from '@helpers/upload-file.helper';
import { PATH_BANNER_IMAGE } from '@constants/path-upload';
import { BannerException } from '@exceptions/app/banner.exception';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { AppConfigService } from 'src/config/app/config.service';
import { get } from 'lodash';
import { S3Service } from '@appotter/nestjs-s3';
import { BannerLinkEnum } from '@enums/banner-link';
import { ProductEntity } from '@entities/tenant/products.entity';
import { ProductException } from '@exceptions/app/product.exception';
import { UpdateOrdinalDto } from '@dtos/v1/backend/update-ordinal.dto';

@Injectable()
export class BannerService {
  private bannerRepository: Repository<BannerEntity>;
  private productRepository: Repository<ProductEntity>;

  constructor(
    @Inject(MERCHANT_CONNECTION) connection: Connection,
    private appConfigService: AppConfigService,
    private uploadFile: UploadFile,
    private s3Service: S3Service,
  ) {
    this.bannerRepository = connection.getRepository(BannerEntity);
    this.productRepository = connection.getRepository(ProductEntity);
  }

  /**
   * @param parameters
   * @returns Pagination<BannerEntity>
   */
  async get(parameters?: any): Promise<Pagination<BannerEntity>> {
    const banners = this.bannerRepository
      .createQueryBuilder()
      .orderBy('ordinal')
      .addOrderBy('id', 'DESC');

    if (parameters.filters?.search) {
      banners.where(`LOWER(title) like :search OR LOWER(title) like :search`, {
        search: `%${parameters.filters.search.toLowerCase()}%`,
      });
    }

    const page = get(parameters, 'page', 1);
    const perPage = get(parameters, 'perPage', 30);

    const options = {
      page: page,
      limit: perPage,
      route: `${this.appConfigService.url}/banners`,
    };

    return paginate<BannerEntity>(banners, options);
  }

  /**
   * @param parameters
   * @returns BannerEntity
   */
  async store(parameters: any): Promise<BannerEntity> {
    if (parameters.linkType === BannerLinkEnum.PRODUCT) {
      await this.getProductById(parameters.linkTo);
    }

    const uploadImage = await this.uploadFile.uploadImage(
      null,
      PATH_BANNER_IMAGE,
      {
        image: parameters.image,
        weight: 1200,
        height: 514,
      },
    );

    parameters = Object.assign(parameters, {
      image: uploadImage,
    });

    const link = {
      type: parameters.linkType,
      value: parameters.linkTo,
    };

    if (parameters.target && parameters.linkType === BannerLinkEnum.EXTERNAL) {
      Object.assign(link, {
        target: parameters.target,
      });
    }

    try {
      const data = {
        image: parameters.image,
        title: parameters.title,
        link: JSON.parse(JSON.stringify(link)),
        ordinal: parameters.ordinal,
        isActive: parameters.isActive,
      };

      if (parameters?.startDate) {
        Object.assign(data, {
          startDate: parameters.startDate,
        });
      }

      if (parameters?.endDate) {
        Object.assign(data, {
          endDate: parameters.endDate,
        });
      }

      return await this.bannerRepository.save(data);
    } catch (error) {
      throw BannerException.createError(error);
    }
  }

  /**
   * @param id
   * @returns BannerEntity
   */
  async findById(id: number): Promise<BannerEntity> {
    const banner = await this.bannerRepository.findOne(id);

    if (!banner) {
      throw BannerException.notFound();
    }

    return banner;
  }

  /**
   * @param id
   * @returns ProductEntity
   */
  async getProductById(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne(id);

    if (!product) {
      throw ProductException.notFound();
    }

    return product;
  }

  /**
   * @param id
   * @param parameters
   * @returns BannerEntity
   */
  async update(id: number, parameters: any): Promise<BannerEntity> {
    const banner = await this.findById(id);
    let image = banner.image;
    let isUpdated = false;

    if (parameters.linkType === BannerLinkEnum.PRODUCT) {
      await this.getProductById(parameters.linkTo);
    }

    if (parameters?.image) {
      const uploadImage = await this.uploadFile.uploadImage(
        null,
        PATH_BANNER_IMAGE,
        {
          image: parameters.image,
          weight: 1200,
          height: 514,
        },
      );

      image = uploadImage;

      if (banner.image) {
        await this.s3Service.delete(banner.image);
        await this.s3Service.delete(`thumbnail-${banner.image}`);
      }
    }

    parameters = Object.assign(parameters, {
      image,
    });
    const link = {
      type: parameters.linkType,
      value: parameters.linkTo,
    };

    if (parameters.target && parameters.linkType === BannerLinkEnum.EXTERNAL) {
      Object.assign(link, {
        target: parameters.target,
      });

      delete parameters.target;
    }

    delete parameters.linkType;
    delete parameters.linkTo;

    Object.assign(parameters, {
      link,
    });

    if (parameters?.startDate) {
      Object.assign(parameters, {
        startDate: parameters.startDate,
      });
    }

    if (parameters?.endDate) {
      Object.assign(parameters, {
        endDate: parameters.endDate,
      });
    }

    try {
      const bannerUpdated = await this.bannerRepository
        .createQueryBuilder()
        .update(BannerEntity)
        .set(parameters)
        .where('id = :id', { id })
        .execute();
      isUpdated = bannerUpdated.affected > 0;
    } catch (error) {
      throw BannerException.updateError(error);
    }

    if (!isUpdated) {
      throw BannerException.updateNotAffected();
    }

    return { ...banner, ...parameters };
  }

  /**
   * @param id
   * @returns void
   */
  async destroy(id: number): Promise<void> {
    await this.findById(id);

    try {
      await this.bannerRepository.softDelete(id);
    } catch (error) {
      throw BannerException.deleteError(error);
    }
  }

  /**
   * @param id
   * @param isActive
   */
  async updateStatus(id: number, isActive: number) {
    await this.findById(id);

    try {
      await this.bannerRepository.update(id, {
        isActive,
      });
    } catch (error) {
      throw BannerException.updateError(error);
    }
  }

  /**
   * @param dto UpdateOrdinalDto
   * @returns void
   */
  async updateOrdinal(dto: UpdateOrdinalDto): Promise<void> {
    try {
      const ordinalItems = dto.ordinal;

      for (const item of ordinalItems) {
        const id = parseInt(get(item, 'id'));
        const ordinal = parseInt(get(item, 'ordinal'));

        if (id && ordinal >= 0) {
          await this.bannerRepository.update(id, {
            ordinal: ordinal,
          });
        }
      }
    } catch (error) {
      throw BannerException.updateError(error);
    }
  }
}
