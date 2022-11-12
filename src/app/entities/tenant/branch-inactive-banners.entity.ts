import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BannerEntity } from './banner.entity';
import { BranchEntity } from './branch.entity';

@Entity('branch_inactive_banners')
@Unique('UNIQUE_BRANCH_BANNER', ['bannerId', 'branchId'])
export class BranchInactiveBannerEntity {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'banner_id', type: 'bigint', unsigned: true })
  bannerId: number;

  @Column({ name: 'branch_id', type: 'bigint', unsigned: true })
  branchId: number;

  @OneToOne(() => BranchEntity, (branch) => branch.id)
  @JoinColumn({
    name: 'branch_id',
    referencedColumnName: 'id',
  })
  branch: BranchEntity;

  @OneToOne(() => BannerEntity, (banner) => banner.id)
  @JoinColumn({
    name: 'banner_id',
    referencedColumnName: 'id',
  })
  banner: BannerEntity;
}
