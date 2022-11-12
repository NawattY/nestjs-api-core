import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableMerchants1661234316430 implements MigrationInterface {
  name = 'createTableMerchants1661234316430';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "merchants" ("id" BIGSERIAL NOT NULL, "title" json NOT NULL, "description" json NOT NULL, "country" character varying(10) NOT NULL, "is_active" smallint NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(0) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(0) with time zone, "deleted_at" TIMESTAMP, CONSTRAINT "PK_4fd312ef25f8e05ad47bfe7ed25" PRIMARY KEY ("id"))`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "merchants"`);
  }
}
