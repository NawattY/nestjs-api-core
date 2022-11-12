import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

module.exports = class UpdateNullableTableProduct1663844031614
  implements MigrationInterface
{
  name = 'UpdateNullableTableProduct1663844031614';

  async up(queryRunner: QueryRunner) {
    await queryRunner.changeColumn(
      'products',
      new TableColumn({
        name: 'detail',
        type: 'json',
      }),
      new TableColumn({
        name: 'detail',
        type: 'json',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      'products',
      new TableColumn({
        name: 'price',
        type: 'int',
        unsigned: true,
      }),
      new TableColumn({
        name: 'price',
        type: 'int',
        unsigned: true,
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      'products',
      new TableColumn({
        name: 'normal_price',
        type: 'int',
        default: null,
        unsigned: true,
        isNullable: true,
      }),
      new TableColumn({
        name: 'normal_price',
        type: 'int',
        default: null,
        unsigned: true,
        isNullable: false,
      }),
    );
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.changeColumn(
      'products',
      new TableColumn({
        name: 'detail',
        type: 'json',
        isNullable: true,
      }),
      new TableColumn({
        name: 'detail',
        type: 'json',
        isNullable: false,
      }),
    );

    await queryRunner.changeColumn(
      'products',
      new TableColumn({
        name: 'price',
        type: 'int',
        unsigned: true,
      }),
      new TableColumn({
        name: 'price',
        type: 'int',
        unsigned: true,
        isNullable: false,
      }),
    );

    await queryRunner.changeColumn(
      'products',
      new TableColumn({
        name: 'normal_price',
        type: 'int',
        default: null,
        unsigned: true,
        isNullable: false,
      }),
      new TableColumn({
        name: 'normal_price',
        type: 'int',
        default: null,
        unsigned: true,
        isNullable: true,
      }),
    );
  }
};
