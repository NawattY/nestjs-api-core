import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BranchEntity } from '@entities/tenant/branch.entity';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { BranchException } from '@exceptions/app/branch.exception';

@Injectable()
export class BranchService {
  private branchRepository: Repository<BranchEntity>;

  constructor(@Inject(MERCHANT_CONNECTION) connection) {
    this.branchRepository = connection.getRepository(BranchEntity);
  }

  async findById(id: number) {
    const branch = await this.branchRepository.findOne({
      where: {
        id: id,
        isActive: 1,
      },
    });

    if (!branch) {
      throw BranchException.notFound();
    }

    return branch;
  }
}
