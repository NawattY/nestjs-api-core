import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ProductEntity } from './products.entity';
import { BranchEntity } from './branch.entity';

@Entity('branch_inactive_products')
@Unique('UNIQUE_BRANCH_INACTIVE_PRODUCT', ['productId', 'branchId'])
export class BranchInactiveProductEntity {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'product_id', type: 'bigint', unsigned: true })
  productId: number;

  @Column({ name: 'branch_id', type: 'bigint', unsigned: true })
  branchId: number;

  @Column({ name: 'out_of_stock', type: 'smallint' })
  outOfStock: number;

  @OneToOne(() => BranchEntity, (branch) => branch.id)
  @JoinColumn({
    name: 'branch_id',
    referencedColumnName: 'id',
  })
  branch: BranchEntity;

  @OneToOne(() => ProductEntity, (product) => product.id)
  @JoinColumn({
    name: 'product_id',
    referencedColumnName: 'id',
  })
  product: ProductEntity;
}
