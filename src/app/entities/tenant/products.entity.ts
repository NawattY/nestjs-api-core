import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BranchInactiveProductEntity } from './branch-inactive-products.entity';
import { BranchRecommendProductEntity } from './branch-recommend-products.entity';
import { CategoryEntity } from './categories.entity';

@Entity('products')
export class ProductEntity {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'title', type: 'json' })
  title: string;

  @Column({ name: 'detail', type: 'json', nullable: true })
  detail: string;

  @Column({
    name: 'normal_price',
    type: 'float',
    default: 0,
    unsigned: true,
  })
  normalPrice: number;

  @Column({
    name: 'special_price',
    type: 'float',
    unsigned: true,
    nullable: true,
  })
  specialPrice: number;

  @Column({ name: 'category_id', type: 'bigint', unsigned: true })
  categoryId: number;

  @Column({ name: 'image', nullable: true })
  image: string;

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

  @ManyToOne(() => CategoryEntity, (category) => category.id)
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'id',
  })
  category: CategoryEntity;

  @OneToMany(
    () => BranchInactiveProductEntity,
    (branchInactiveProduct) => branchInactiveProduct.product,
  )
  @JoinColumn({
    name: 'id',
    referencedColumnName: 'product_id',
  })
  branchInactiveProducts: BranchInactiveProductEntity;

  @OneToMany(
    () => BranchRecommendProductEntity,
    (branchRecommendProduct) => branchRecommendProduct.product,
  )
  @JoinColumn({
    name: 'id',
    referencedColumnName: 'product_id',
  })
  branchRecommendProducts: BranchRecommendProductEntity;
}
