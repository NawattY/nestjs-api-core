import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

module.exports = class merchantDescription1663127306886
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner) {
    await queryRunner.changeColumn(
      'merchants',
      new TableColumn({
        name: 'description',
        type: 'json',
      }),
      new TableColumn({
        name: 'description',
        type: 'json',
        isNullable: true,
      }),
    );
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.changeColumn(
      'merchants',
      new TableColumn({
        name: 'description',
        type: 'json',
      }),
      new TableColumn({
        name: 'description',
        type: 'json',
        isNullable: false,
      }),
    );
  }
};
