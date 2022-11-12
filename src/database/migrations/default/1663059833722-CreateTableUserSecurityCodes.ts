import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUserSecurityCodes1663059833722
  implements MigrationInterface
{
  name = 'CreateTableUserSecurityCodes1663059833722';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_security_codes" (
        "id" BIGSERIAL NOT NULL, 
        "user_id" bigint NOT NULL, 
        "type" character varying NOT NULL, 
        "token" character varying NOT NULL, 
        "expired_at" TIMESTAMP, 
        "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(0) with time zone, 
        "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(0) with time zone, CONSTRAINT "PK_e00d23de4d288160d5ea69e2861" PRIMARY KEY ("id")
        )`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_security_codes"`);
  }
}
