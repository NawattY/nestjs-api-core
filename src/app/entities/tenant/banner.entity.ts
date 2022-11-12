import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BranchInactiveBannerEntity } from '@entities/tenant/branch-inactive-banners.entity';

@Entity('banners')
export class BannerEntity {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({ name: 'link', type: 'json', nullable: true })
  link: string;

  @Column({ name: 'start_date', type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ name: 'image' })
  image: string;

  @Column({ name: 'ordinal', type: 'int', default: 0 })
  ordinal: number;

  @Column({ name: 'is_active', type: 'smallint', default: 0 })
  isActive: number;

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

  @OneToMany(
    () => BranchInactiveBannerEntity,
    (branchInactiveBanner) => branchInactiveBanner.bannerId,
  )
  @JoinColumn({
    name: 'id',
    referencedColumnName: 'banner_id',
  })
  branchInactiveBanner: BranchInactiveBannerEntity;
}
