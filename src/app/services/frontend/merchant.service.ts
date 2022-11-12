import { CACHE_MANAGER, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantEntity } from 'src/app/entities/default/merchant.entity';
import { Repository } from 'typeorm';
import { MerchantException } from '@exceptions/app/merchant.exception';
import { Cache } from 'cache-manager';
import { get, isEmpty } from 'lodash';

@Injectable({ scope: Scope.REQUEST })
export class MerchantService {
  constructor(
    @InjectRepository(MerchantEntity)
    private merchantRepository: Repository<MerchantEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getByDomain(domain: string): Promise<MerchantEntity> {
    const merchant = await this.merchantRepository.findOne({
      where: {
        domain,
        isActive: 1,
      },
    });

    if (!merchant) {
      throw MerchantException.notFound();
    }

    return merchant;
  }

  async getSettings(id: number): Promise<string> {
    const merchant = await this.merchantRepository
      .createQueryBuilder()
      .where('id = :merchantId', { merchantId: id })
      .select(['settings'])
      .getRawOne();

    if (!merchant) {
      throw MerchantException.notFound();
    }

    return merchant.settings;
  }

  async findById(id: number): Promise<MerchantEntity> {
    const merchant = await this.merchantRepository.findOne({
      where: {
        id,
        isActive: 1,
      },
    });

    if (!merchant) {
      throw MerchantException.notFound();
    }

    return merchant;
  }

  async getDefaultLocale(id: number): Promise<string> {
    let defaultLocale: string = await this.cacheManager.get(
      `default-locale-${id}`,
    );

    if (!defaultLocale) {
      const merchant = await this.findById(id);
      defaultLocale = get(merchant.settings, 'locale', '');

      if (isEmpty(defaultLocale)) {
        throw MerchantException.notHasDefaultLocale();
      }

      this.cacheManager.set(`default-locale-${id}`, defaultLocale, {
        ttl: 86400,
      });
    }

    return defaultLocale;
  }
}
