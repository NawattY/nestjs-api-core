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

@Entity('branch_recommend_products')
@Unique('UNIQUE_BRANCH_RECOMMEND_PRODUCT', ['productId', 'branchId'])
export class BranchRecommendProductEntity {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'product_id', type: 'bigint', unsigned: true })
  productId: number;

  @Column({ name: 'branch_id', type: 'bigint', unsigned: true })
  branchId: number;

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
