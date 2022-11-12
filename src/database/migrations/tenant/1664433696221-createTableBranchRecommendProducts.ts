import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

module.exports = class createTableBranchRecommendProducts1664433696221
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'branch_recommend_products',
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
        ],
      }),
      true,
    );

    await queryRunner.createUniqueConstraint(
      'branch_recommend_products',
      new TableUnique({
        name: 'UNIQUE_BRANCH_RECOMMEND_PRODUCT',
        columnNames: ['product_id', 'branch_id'],
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint(
      'branch_recommend_products',
      'UNIQUE_BRANCH_RECOMMEND_PRODUCT',
    );
    await queryRunner.dropTable('branch_recommend_products');
  }
};
