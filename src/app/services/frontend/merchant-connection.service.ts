import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MerchantConnectionEntity } from '@entities/default/merchant-connections.entity';
import { isEmpty } from 'lodash';
import { MerchantException } from '@exceptions/app/merchant.exception';

@Injectable()
export class MerchantConnectionService {
  constructor(
    @InjectRepository(MerchantConnectionEntity)
    private merchantConnectionRepository: Repository<MerchantConnectionEntity>,
  ) {}

  async getConnection(merchantId: number): Promise<MerchantConnectionEntity> {
    const merchantConnection = await this.merchantConnectionRepository.findOne({
      where: { merchantId },
    });

    if (isEmpty(merchantConnection)) {
      throw MerchantException.merchantConnectionFailed();
    }

    return merchantConnection;
  }
}
