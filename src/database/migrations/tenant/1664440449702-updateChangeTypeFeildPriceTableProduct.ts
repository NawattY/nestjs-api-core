import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

module.exports = class updateChangeTypeFeildPriceTableProduct1664440449702
  implements MigrationInterface
{
  name = 'updateChangeTypeFeildPriceTableProduct1664440449702';

  async up(queryRunner: QueryRunner) {
    await queryRunner.changeColumn(
      'products',
      new TableColumn({
        name: 'special_price',
        type: 'int',
        unsigned: true,
        isNullable: true,
      }),
      new TableColumn({
        name: 'special_price',
        type: 'decimal',
        precision: 12,
        scale: 4,
        unsigned: true,
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      'products',
      new TableColumn({
        name: 'normal_price',
        type: 'int',
        unsigned: true,
        isNullable: false,
        default: 0,
      }),
      new TableColumn({
        name: 'normal_price',
        type: 'decimal',
        precision: 12,
        scale: 4,
        unsigned: true,
        isNullable: false,
        default: 0,
      }),
    );
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.changeColumn(
      'products',
      new TableColumn({
        name: 'special_price',
        type: 'decimal',
        precision: 12,
        scale: 4,
        unsigned: true,
        isNullable: true,
      }),
      new TableColumn({
        name: 'special_price',
        type: 'int',
        unsigned: true,
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      'products',
      new TableColumn({
        name: 'normal_price',
        type: 'decimal',
        precision: 12,
        scale: 4,
        unsigned: true,
        isNullable: false,
        default: 0,
      }),
      new TableColumn({
        name: 'normal_price',
        type: 'int',
        unsigned: true,
        isNullable: false,
        default: 0,
      }),
    );
  }
};
