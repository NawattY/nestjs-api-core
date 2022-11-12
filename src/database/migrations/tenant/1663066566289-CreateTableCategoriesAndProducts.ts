import { MigrationInterface, QueryRunner, Table } from 'typeorm';

module.exports = class CreateTableCategoriesAndProducts1663066566289
  implements MigrationInterface
{
  name = 'CreateTableCategoriesAndProducts1663066566289';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'title',
            type: 'json',
          },
          {
            name: 'is_active',
            type: 'smallint',
            default: 1,
          },
          {
            name: 'ordinal',
            type: 'int',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'title',
            type: 'json',
          },
          {
            name: 'detail',
            type: 'json',
          },
          {
            name: 'normal_price',
            type: 'int',
            isNullable: true,
            default: null,
            unsigned: true,
          },
          {
            name: 'price',
            type: 'int',
            unsigned: true,
          },
          {
            name: 'category_id',
            type: 'int',
            unsigned: true,
          },
          {
            name: 'image',
            type: 'text',
          },
          {
            name: 'is_active',
            type: 'int',
            default: 1,
          },
          {
            name: 'ordinal',
            type: 'int',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('categories');
    await queryRunner.dropTable('products');
  }
};
