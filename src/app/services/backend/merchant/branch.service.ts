import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BranchEntity } from '@entities/tenant/branch.entity';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { BranchException } from '@exceptions/app/branch.exception';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { AppConfigService } from 'src/config/app/config.service';
import { get } from 'lodash';

@Injectable()
export class BranchService {
  private branchRepository: Repository<BranchEntity>;

  constructor(
    @Inject(MERCHANT_CONNECTION) connection,
    private appConfigService: AppConfigService,
  ) {
    this.branchRepository = connection.getRepository(BranchEntity);
  }

  async get(parameters?: any): Promise<Pagination<BranchEntity>> {
    const branches = this.branchRepository
      .createQueryBuilder()
      .orderBy('is_active', 'DESC')
      .addOrderBy('id', 'DESC');

    if (parameters.filters?.search) {
      branches.where(`LOWER(title->>'th') like :th`, {
        th: `%${parameters.filters.search.toLowerCase()}%`,
      });
      branches.orWhere(`LOWER(title->>'en') like :en`, {
        en: `%${parameters.filters.search.toLowerCase()}%`,
      });
    }

    const page = get(parameters, 'page', 1);
    const perPage = get(parameters, 'perPage', 30);

    const options = {
      page,
      limit: perPage,
      route: `${this.appConfigService.url}/branches`,
    };

    return paginate<BranchEntity>(branches, options);
  }

  async store(branchDto: any) {
    try {
      return await this.branchRepository.save({
        title: JSON.parse(JSON.stringify(branchDto.title)),
        detail: branchDto.detail,
        phone: branchDto.phone,
        isActive: branchDto.isActive,
      });
    } catch (error) {
      throw BranchException.createError(error);
    }
  }

  async findById(id: number) {
    const branch = await this.branchRepository.findOne(id);

    if (!branch) {
      throw BranchException.notFound();
    }

    return branch;
  }

  async update(id: number, branchDto: any) {
    let isUpdated = false;

    try {
      const branchUpdated = await this.branchRepository
        .createQueryBuilder()
        .update(BranchEntity)
        .set(branchDto)
        .where('id = :id', { id })
        .execute();

      isUpdated = branchUpdated.affected > 0;
    } catch (error) {
      throw BranchException.updateError(error);
    }

    if (!isUpdated) {
      BranchException.notFound();
    }

    return await this.findById(id);
  }

  async destroy(id: number) {
    await this.findById(id);

    try {
      await this.branchRepository.softDelete(id);
    } catch (error) {
      throw BranchException.deleteError(error);
    }
  }

  async updateStatus(id: number, isActive: number) {
    await this.findById(id);

    try {
      await this.branchRepository.update(id, { isActive });
    } catch (error) {
      throw BranchException.updateError(error);
    }
  }
}
