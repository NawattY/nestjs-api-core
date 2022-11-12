import { MigrationInterface, QueryRunner } from 'typeorm';

module.exports = class UpdateFeildPriceTableProduct1663844031620
  implements MigrationInterface
{
  name = 'UpdateFeildPriceTableProduct1663844031620';

  async up(queryRunner: QueryRunner) {
    await queryRunner.renameColumn('products', 'price', 'special_price');
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.renameColumn('products', 'special_price', 'price');
  }
};
