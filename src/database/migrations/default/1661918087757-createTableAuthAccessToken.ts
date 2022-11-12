import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableAuthAccessToken1661918087757
  implements MigrationInterface
{
  name = 'createTableAuthAccessToken1661918087757';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auth_access_token" ("id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "token" character varying NOT NULL, "expired_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(0) with time zone, CONSTRAINT "PK_63cf49f69d2fc9ec3cc9aaa739d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_access_token" ADD CONSTRAINT "FK_00568545bb5a0932aa53a3993de" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth_access_token" DROP CONSTRAINT "FK_00568545bb5a0932aa53a3993de"`,
    );
    await queryRunner.query(`DROP TABLE "auth_access_token"`);
  }
}
