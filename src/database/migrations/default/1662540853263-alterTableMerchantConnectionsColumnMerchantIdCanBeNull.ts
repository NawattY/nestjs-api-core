import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTableMerchantConnectionsColumnMerchantIdCanBeNull1662540853263
  implements MigrationInterface
{
  name = 'alterTableMerchantConnectionsColumnMerchantIdCanBeNull1662540853263';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "merchant_connections" ALTER COLUMN "merchant_id" DROP NOT NULL`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "merchant_connections" ALTER COLUMN "merchant_id" SET NOT NULL`,
    );
  }
}
