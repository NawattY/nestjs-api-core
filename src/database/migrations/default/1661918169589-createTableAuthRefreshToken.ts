import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableAuthRefreshToken1661918169589
  implements MigrationInterface
{
  name = 'createTableAuthRefreshToken1661918169589';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auth_refresh_token" ("auth_access_token_id" BIGSERIAL NOT NULL, "token" character varying NOT NULL, "expired_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(0) with time zone, CONSTRAINT "REL_867b0bb5307affa2722abc8547" UNIQUE ("auth_access_token_id"), CONSTRAINT "PK_867b0bb5307affa2722abc85474" PRIMARY KEY ("auth_access_token_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_refresh_token" ADD CONSTRAINT "FK_867b0bb5307affa2722abc85474" FOREIGN KEY ("auth_access_token_id") REFERENCES "auth_access_token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth_refresh_token" DROP CONSTRAINT "FK_867b0bb5307affa2722abc85474"`,
    );
    await queryRunner.query(`DROP TABLE "auth_refresh_token"`);
  }
}
