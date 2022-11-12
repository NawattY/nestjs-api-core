import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { MerchantConnectionEntity } from '@entities/default/merchant-connections.entity';
import { isEmpty } from 'lodash';
import { MerchantException } from '@exceptions/app/merchant.exception';
import { get } from 'lodash';
import { Connection, createConnection, getConnectionManager } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as tenantsOrmconfig from '../../../tenants-ormconfig';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(MerchantConnectionEntity)
    private merchantConnectionRepository: Repository<MerchantConnectionEntity>,
  ) {}

  async setTenantConnection(merchantId: number): Promise<Connection> {
    const merchantConnection = await this.getConnection(merchantId);
    return this.createTenantConnection(merchantConnection);
  }

  async migrate(merchantId: number): Promise<void> {
    const merchantConnection = await this.getMerchantConnection(merchantId);
    await this.migration(merchantConnection);
  }

  async migrateAll(): Promise<void> {
    const merchantConnections = await this.merchantConnectionRepository.find({
      where: {
        merchantId: Not(IsNull()),
      },
    });

    for (const merchantConnection of merchantConnections) {
      await this.migration(merchantConnection);
    }
  }

  async rollback(merchantId: number): Promise<void> {
    const merchantConnection = await this.getMerchantConnection(merchantId);
    await this.undoMigration(merchantConnection);
  }

  async rollbackAll(): Promise<void> {
    const merchantConnections = await this.merchantConnectionRepository.find({
      where: {
        merchantId: Not(IsNull()),
      },
    });

    for (const merchantConnection of merchantConnections) {
      await this.undoMigration(merchantConnection);
    }
  }

  private async getConnection(
    merchantId: number,
  ): Promise<MerchantConnectionEntity> {
    const merchantConnection = await this.merchantConnectionRepository.findOne({
      where: { merchantId },
    });

    if (isEmpty(merchantConnection)) {
      throw MerchantException.merchantConnectionFailed();
    }

    return merchantConnection;
  }

  private async getMerchantConnection(
    merchantId: number,
  ): Promise<MerchantConnectionEntity> {
    const merchantConnection = await this.merchantConnectionRepository.findOne({
      where: { merchantId: merchantId },
    });

    if (isEmpty(merchantConnection)) {
      throw MerchantException.merchantConnectionFailed();
    }

    return merchantConnection;
  }

  private async createTenantConnection(
    merchantConnection: MerchantConnectionEntity,
  ): Promise<Connection> {
    const connectionName = `tenant_${merchantConnection.id}`;
    const connectionManager = getConnectionManager();

    if (connectionManager.has(connectionName)) {
      const connection = connectionManager.get(connectionName);
      return Promise.resolve(
        connection.isConnected ? connection : connection.connect(),
      );
    }

    return createConnection({
      ...(tenantsOrmconfig as PostgresConnectionOptions),
      name: connectionName,
      host: get(merchantConnection.connection, 'host'),
      port: parseInt(get(merchantConnection.connection, 'port')),
      username: get(merchantConnection.connection, 'username'),
      password: get(merchantConnection.connection, 'password'),
      database: get(merchantConnection.connection, 'database'),
    });
  }

  private async migration(merchantConnection: MerchantConnectionEntity) {
    //TODO - try catch + log
    const connection = await this.createTenantConnection(merchantConnection);
    await connection.runMigrations();
    await connection.close();
  }

  private async undoMigration(merchantConnection: MerchantConnectionEntity) {
    //TODO - try catch + log
    const connection = await this.createTenantConnection(merchantConnection);
    await connection.undoLastMigration();
    await connection.close();
  }
}
