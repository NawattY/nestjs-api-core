import { UserEntity } from 'src/app/entities/default/user.entity';
import { CACHE_MANAGER, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantEntity } from 'src/app/entities/default/merchant.entity';
import { Connection, Repository, Not, Brackets } from 'typeorm';
import { MerchantException } from '@exceptions/app/merchant.exception';
import { MerchantStoreDto } from '@dtos/v1/backend/admin/merchant/merchant-store.dto';
import * as bcrypt from 'bcrypt';
import { UserType } from '@enums/user-type';
import { MerchantConnectionEntity } from '@entities/default/merchant-connections.entity';
import { TenantsService } from 'src/app/tenancy/tenancy.service';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { ConfigService } from '@nestjs/config';
import { get, isEmpty } from 'lodash';
import { MerchantUpdateDto } from '@dtos/v1/backend/admin/merchant/update.dto';
import { Cache } from 'cache-manager';
import { PATH_MERCHANT_IMAGE } from '@constants/path-upload';
import { UploadFile } from '@helpers/upload-file.helper';

@Injectable({ scope: Scope.REQUEST })
export class MerchantService {
  constructor(
    @InjectRepository(MerchantEntity)
    private merchantRepository: Repository<MerchantEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(MerchantConnectionEntity)
    private merchantConnectionRepository: Repository<MerchantConnectionEntity>,
    private tenantsService: TenantsService,
    private readonly connection: Connection,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private uploadFile: UploadFile,
  ) {}

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

      await this.cacheManager.set(`default-locale-${id}`, defaultLocale, {
        ttl: 86400,
      });
    }

    return defaultLocale;
  }

  async get(parameters?: any): Promise<Pagination<MerchantEntity>> {
    const merchants = this.merchantRepository
      .createQueryBuilder()
      .orderBy('id', 'DESC');

    if (parameters.filters?.isActive) {
      merchants.where(`is_active = :isActive`, {
        isActive: parameters.filters.isActive,
      });
    }

    if (parameters.filters?.search) {
      merchants.andWhere(
        new Brackets((query) => {
          query.where(
            `LOWER(title->>'th') like :search OR LOWER(title->>'en') like :search`,
            {
              search: `%${parameters.filters.search.toLowerCase()}%`,
            },
          );
        }),
      );
    }

    const page = get(parameters, 'page') ? get(parameters, 'page') : 1;
    const perPage = get(parameters, 'perPage')
      ? get(parameters, 'perPage')
      : 30;

    const options = {
      page: page,
      limit: perPage,
      route: `${this.configService.get('APP_URL')}/merchants`,
    };

    return paginate<MerchantEntity>(merchants, options);
  }

  async findById(id: number): Promise<MerchantEntity> {
    const merchant = await this.merchantRepository.findOne({
      where: {
        id,
      },
    });

    if (!merchant) {
      throw MerchantException.notFound();
    }

    return merchant;
  }

  /**
   *
   * @param domain
   * @param id
   */
  private async checkDomain(domain: string, id?: number): Promise<void> {
    const condition = {
      domain,
    };

    if (id) {
      condition['id'] = Not(id);
    }

    const merchant = await this.merchantRepository.findOne({
      where: condition,
    });

    if (merchant) {
      throw MerchantException.duplicateDomain();
    }
  }

  /**
   *
   * @param params
   * @returns
   */
  async store(params: MerchantStoreDto): Promise<MerchantEntity> {
    await this.checkDomain(params.domain);
    const userExist = await this.userRepository.findOne({
      where: {
        email: params.email,
      },
    });

    if (userExist) {
      throw MerchantException.userEmailAlreadyExist();
    }
    const path = 'storage/logo_default.png';
    const locationLogoImage = await this.uploadFile.uploadImage(
      path,
      PATH_MERCHANT_IMAGE,
      { weight: 140, height: 140 },
    );
    const merchantResult = await this.connection.manager.transaction(
      async (entityManager) => {
        try {
          const setting = {
            locale: 'th',
            logoImage: locationLogoImage,
            primaryColor: '#2b3d98',
            textOnPrimaryColor: '#ffffff',
            backgroundColor: '#2b3d98',
            secondaryColor: '',
            highlightTextColor: '',
            supportLocales: ['th'],
          };

          const merchant = await entityManager.save(MerchantEntity, {
            title: params.title,
            description: params.description,
            domain: params.domain,
            settings: JSON.parse(JSON.stringify(setting)),
            isActive: 1,
          });

          //create user
          const salt = await bcrypt.genSalt();
          const password = params.password;
          const hash = await bcrypt.hash(password, salt);

          await entityManager.save(UserEntity, {
            fullName: params.name,
            email: params.email,
            password: hash,
            mobile: params.mobile,
            type: UserType.MERCHANT,
            isActive: 1,
            merchantId: merchant.id,
          });

          //update merchant connection
          await entityManager.update(
            MerchantConnectionEntity,
            {
              id: params.connectionId,
            },
            { merchantId: merchant.id },
          );

          return merchant;
        } catch (error) {
          throw new Error(
            `${MerchantService.name} create error. ${error.message}`,
          );
        }
      },
    );

    try {
      await this.tenantsService.migrate(merchantResult.id);
    } catch (error) {
      this.removeSetupMerchant(params, merchantResult.id);
      throw new Error(
        `${MerchantService.name} migrate error. ${error.message}`,
      );
    }

    return merchantResult;
  }

  //remove merchant and user but merchant connect use update merchant id to null
  /**
   *
   * @param params
   * @param merchantId
   */
  async removeSetupMerchant(params: MerchantStoreDto, merchantId: number) {
    await this.merchantRepository.delete(merchantId);
    await this.merchantConnectionRepository.update(
      { merchantId },
      { merchantId: 0 },
    );
    await this.userRepository.delete({
      merchantId,
      email: params.email,
      fullName: params.name,
    });
  }

  async update(id: number, params: MerchantUpdateDto): Promise<MerchantEntity> {
    await this.checkDomain(params.domain, id);
    const merchant = await this.findById(id);

    try {
      return await this.merchantRepository.save({
        id: merchant.id,
        title: params.title,
        domain: params.domain,
      });
    } catch (error) {
      throw MerchantException.updateError(error);
    }
  }

  //remove merchant and user but merchant connect use update merchant id to null
  /**
   *
   * @param params
   * @param merchantId
   */
  async removeSetupMerchantUpdate(
    params: MerchantUpdateDto,
    merchantId: number,
  ) {
    await this.merchantRepository.delete(merchantId);
    await this.merchantConnectionRepository.update(
      { merchantId },
      { merchantId: null },
    );
    await this.userRepository.delete({
      merchantId,
      email: params.email,
      fullName: params.name,
    });
  }

  async updateStatus(id: number, isActive: number) {
    await this.findById(id);

    try {
      await this.merchantRepository.update(id, { isActive });
    } catch (error) {
      throw MerchantException.updateError(error);
    }
  }

  async destroy(id: number): Promise<void> {
    await this.findById(id);

    try {
      await this.merchantRepository.softDelete(id);
    } catch (error) {
      throw MerchantException.deleteError(error);
    }
  }
}
