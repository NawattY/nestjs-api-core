import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BranchInactiveCategoryEntity } from '@entities/tenant/branch-inactive-categories.entity';
import { ProductEntity } from '@entities/tenant/products.entity';

@Entity('categories')
export class CategoryEntity {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'title', type: 'json' })
  title: string;

  @Column({ name: 'is_active', type: 'smallint', default: 1 })
  isActive: number;

  @Column({ name: 'ordinal', type: 'int', default: 0 })
  ordinal: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(0)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(0)',
    onUpdate: 'CURRENT_TIMESTAMP(0)',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: Date;

  @OneToMany(() => ProductEntity, (product) => product.category)
  @JoinColumn({
    name: 'id',
    referencedColumnName: 'category_id',
  })
  products: ProductEntity;

  @OneToMany(
    () => BranchInactiveCategoryEntity,
    (branchInactiveCategory) => branchInactiveCategory.category,
  )
  @JoinColumn({
    name: 'id',
    referencedColumnName: 'category_id',
  })
  branchInactiveCategories: BranchInactiveCategoryEntity;
}
