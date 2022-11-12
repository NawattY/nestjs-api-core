import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

module.exports = class createTableBranchInactiveCategories1664432539055
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'branch_inactive_categories',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'category_id',
            type: 'bigint',
          },
          {
            name: 'branch_id',
            type: 'bigint',
          },
        ],
      }),
      true,
    );

    await queryRunner.createUniqueConstraint(
      'branch_inactive_categories',
      new TableUnique({
        name: 'UNIQUE_BRANCH_INACTIVE_CATEGORY',
        columnNames: ['category_id', 'branch_id'],
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint(
      'branch_inactive_categories',
      'UNIQUE_BRANCH_INACTIVE_CATEGORY',
    );
    await queryRunner.dropTable('branch_inactive_categories');
  }
};
