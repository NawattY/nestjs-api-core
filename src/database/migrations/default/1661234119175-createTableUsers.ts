import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUsers1661234119175 implements MigrationInterface {
  name = 'createTableUsers1661234119175';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" BIGSERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "merchant_id" bigint NOT NULL, "is_active" smallint NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(0) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(0) with time zone, "deleted_at" TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
