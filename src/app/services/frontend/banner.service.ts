import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { BannerEntity } from '@entities/tenant/banner.entity';
import { BannerException } from '@exceptions/app/banner.exception';
import { format } from 'date-fns';

@Injectable()
export class BannerService {
  private bannerRepository: Repository<BannerEntity>;

  constructor(@Inject(MERCHANT_CONNECTION) connection) {
    this.bannerRepository = connection.getRepository(BannerEntity);
  }

  async get(branchId: number): Promise<any[]> {
    const dateNow = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

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
      .andWhere('inactive.banner_id IS NULL')
      .andWhere('(start_date <= :dateNow OR start_date IS NULL)', {
        dateNow,
      })
      .andWhere('(end_date >= :dateNow OR end_date IS NULL)', {
        dateNow,
      })
      .orderBy('banners.ordinal')
      .groupBy('inactive.id')
      .addGroupBy('banners.id')
      .getRawMany();

    return banners;
  }

  /**
   * @param id
   * @returns BannerEntity
   */
  async findById(id: number, branchId: number): Promise<BannerEntity> {
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
}
