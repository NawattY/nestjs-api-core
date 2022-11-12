import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableMerchantConnections1661234193003
  implements MigrationInterface
{
  name = 'createTableMerchantConnections1661234193003';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "merchant_connections" ("id" BIGSERIAL NOT NULL, "merchant_id" bigint NOT NULL, "prefix" character varying NOT NULL, "connection" json NOT NULL, CONSTRAINT "PK_6d08461067dedbb933c0764f8e4" PRIMARY KEY ("id"))`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "merchant-connections"`);
  }
}
