import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTableUserCombineFirstNameAndLastNameToFullName1662483870414
  implements MigrationInterface
{
  name = 'alterTableUserCombineFirstNameAndLastNameToFullName1662483870414';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE users SET first_name = COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN first_name TO full_name`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "last_name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN full_name TO first_name`,
    );
  }
}
