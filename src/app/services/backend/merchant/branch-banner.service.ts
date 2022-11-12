import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { BannerEntity } from '@entities/tenant/banner.entity';
import { BranchInactiveBannerEntity } from '@entities/tenant/branch-inactive-banners.entity';
import { BranchInactiveBannerException } from '@exceptions/app/branch-inactive-banner.exception';
import { paginateRaw, Pagination } from 'nestjs-typeorm-paginate';
import { AppConfigService } from 'src/config/app/config.service';
import { get } from 'lodash';
import { BannerException } from '@exceptions/app/banner.exception';

@Injectable()
export class BranchBannerService {
  private branchInactiveBannerRepository: Repository<BranchInactiveBannerEntity>;
  private bannerRepository: Repository<BannerEntity>;

  constructor(
    @Inject(MERCHANT_CONNECTION) connection,
    private appConfigService: AppConfigService,
  ) {
    this.bannerRepository = connection.getRepository(BannerEntity);
    this.branchInactiveBannerRepository = connection.getRepository(
      BranchInactiveBannerEntity,
    );
  }

  /**
   * @param id
   * @param branchId
   * @returns
   */
  async findById(id: number, branchId: number) {
    const banner = await this.bannerRepository
      .createQueryBuilder('banners')
      .where('banners.id = :bannerId', { bannerId: id })
      .andWhere('banners.is_active = 1')
      .leftJoinAndSelect(
        'branch_inactive_banners',
        'inactive',
        'inactive.branch_id = :branchId AND inactive.banner_id = banners.id',
        {
          branchId,
        },
      )
      .getRawOne();

    if (!banner) {
      throw BannerException.notFound();
    }

    return banner;
  }

  /**
   * @param id
   * @param parameters
   */
  async updateStatus(id: number, parameters?: any) {
    const branchInactiveBanner = await this.findById(id, parameters.branchId);

    if (get(branchInactiveBanner, 'inactive_id') && parameters.isActive == 1) {
      try {
        await this.branchInactiveBannerRepository.delete(
          branchInactiveBanner.inactive_id,
        );
      } catch (error) {
        throw BranchInactiveBannerException.deleteError(error);
      }
    }

    if (!get(branchInactiveBanner, 'inactive_id') && parameters.isActive == 0) {
      try {
        await this.branchInactiveBannerRepository.save({
          branchId: parameters.branchId,
          bannerId: id,
        });
      } catch (error) {
        throw BranchInactiveBannerException.createError(error);
      }
    }
  }

  /**
   * @param branchId
   * @param parameters
   * @returns
   */
  async get(
    branchId: number,
    parameters?: any,
  ): Promise<Pagination<BannerEntity>> {
    const banners = this.bannerRepository
      .createQueryBuilder('banners')
      .where('banners.is_active = 1')
      .leftJoinAndSelect(
        'branch_inactive_banners',
        'inactive',
        'inactive.branch_id = :branchId AND inactive.banner_id = banners.id',
        {
          branchId,
        },
      )
      .orderBy('inactive.branch_id', 'DESC')
      .addOrderBy('banners.ordinal')
      .groupBy('inactive.id')
      .addGroupBy('banners.id');

    if (parameters?.filters?.search) {
      banners.andWhere(`LOWER(banners.title) like :search`, {
        search: `%${parameters.filters.search.toLowerCase()}%`,
      });
    }

    const page = get(parameters, 'page');
    const perPage = get(parameters, 'perPage');

    const options = {
      page: page ? page : 1,
      limit: perPage ? perPage : 30,
      route: `${this.appConfigService.url}/branch-banners`,
    };

    return paginateRaw<BannerEntity>(banners, options);
  }
}
