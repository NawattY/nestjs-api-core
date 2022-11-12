import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BranchEntity } from './branch.entity';
import { CategoryEntity } from './categories.entity';

@Entity('branch_inactive_categories')
@Unique('UNIQUE_BRANCH_INACTIVE_CATEGORY', ['categoryId', 'branchId'])
export class BranchInactiveCategoryEntity {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'category_id', type: 'bigint', unsigned: true })
  categoryId: number;

  @Column({ name: 'branch_id', type: 'bigint', unsigned: true })
  branchId: number;

  @OneToOne(() => BranchEntity, (branch) => branch.id)
  @JoinColumn({
    name: 'branch_id',
    referencedColumnName: 'id',
  })
  branch: BranchEntity;

  @OneToOne(() => CategoryEntity, (category) => category.id)
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'id',
  })
  category: CategoryEntity;
}
