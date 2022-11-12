import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMoreFeildOnUsersTable1662018824136
  implements MigrationInterface
{
  name = 'AddMoreFeildOnUsersTable1662018824136';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN username TO email`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "profile_image" text`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN email TO username`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile_image"`);
  }
}
