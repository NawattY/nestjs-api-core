import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MerchantConnectionEntity } from './merchant-connections.entity';
import { UserEntity } from './user.entity';

@Entity('merchants')
export class MerchantEntity {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'title', type: 'json' })
  title: string;

  @Column({ name: 'description', type: 'json', nullable: true })
  description: string;

  @Column({ name: 'settings', type: 'json' })
  settings: string;

  @Column({ name: 'domain', type: 'varchar' })
  domain: string;

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

  @OneToOne(() => UserEntity, (user) => user.merchantId)
  @JoinColumn({
    name: 'id',
    referencedColumnName: 'merchantId',
  })
  user: UserEntity;

  @OneToOne(
    () => MerchantConnectionEntity,
    (merchantConnection) => merchantConnection.merchantId,
  )
  @JoinColumn({
    name: 'id',
    referencedColumnName: 'merchantId',
  })
  merchantConnection: MerchantConnectionEntity;
}
