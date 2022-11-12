import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFeildDomainSettingsAndDropCountryOnMerchantsTable1662020486917
  implements MigrationInterface
{
  name = 'addFeildDomainSettingsAndDropCountryOnMerchantsTable1662020486917';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "merchants" DROP COLUMN "country"`);
    await queryRunner.query(`ALTER TABLE "merchants" ADD "settings" json`);
    await queryRunner.query(
      `ALTER TABLE "merchants" ADD "domain" character varying`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "merchants" DROP COLUMN "domain"`);
    await queryRunner.query(`ALTER TABLE "merchants" DROP COLUMN "settings"`);
    await queryRunner.query(
      `ALTER TABLE "merchants" ADD "country" character varying(10) NOT NULL`,
    );
  }
}
