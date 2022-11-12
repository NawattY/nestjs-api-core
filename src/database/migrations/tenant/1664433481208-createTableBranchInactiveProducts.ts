import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

module.exports = class createTableBranchInactiveProducts1664433481208
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'branch_inactive_products',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'product_id',
            type: 'bigint',
          },
          {
            name: 'branch_id',
            type: 'bigint',
          },
          {
            name: 'out_of_stock',
            type: 'int',
          },
        ],
      }),
      true,
    );

    await queryRunner.createUniqueConstraint(
      'branch_inactive_products',
      new TableUnique({
        name: 'UNIQUE_BRANCH_INACTIVE_PRODUCT',
        columnNames: ['product_id', 'branch_id'],
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint(
      'branch_inactive_products',
      'UNIQUE_BRANCH_INACTIVE_PRODUCT',
    );
    await queryRunner.dropTable('branch_inactive_products');
  }
};
