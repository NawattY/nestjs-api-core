import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableUsersAddColumnMobileAndType1661315774140
  implements MigrationInterface
{
  name = 'alterTableUsersAddColumnMobileAndType1661315774140';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "mobile" character varying`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_type_enum" AS ENUM('admin', 'merchant', 'staff')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "type" "public"."users_type_enum" NOT NULL DEFAULT 'merchant'`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."users_type_enum"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "mobile"`);
  }
}
