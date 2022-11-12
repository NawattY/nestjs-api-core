import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTableMerchantConnectionsAddTitle1662609483473
  implements MigrationInterface
{
  name = 'alterTableMerchantConnectionsAddTitle1662609483473';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "merchant_connections" ADD "title" character varying NOT NULL DEFAULT ''`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "merchant_connections" DROP COLUMN "title"`,
    );
  }
}
