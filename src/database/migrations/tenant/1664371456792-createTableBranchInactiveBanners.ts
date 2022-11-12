import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

module.exports = class createTableBranchInactiveBanners1664371456792
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'branch_inactive_banners',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'banner_id',
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
      'branch_inactive_banners',
      new TableUnique({
        name: 'UNIQUE_BRANCH_BANNER',
        columnNames: ['banner_id', 'branch_id'],
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint(
      'branch_inactive_banners',
      'UNIQUE_BRANCH_BANNER',
    );
    await queryRunner.dropTable('branch_inactive_banners');
  }
};
