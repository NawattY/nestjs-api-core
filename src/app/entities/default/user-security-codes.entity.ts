import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_security_codes')
export class UserSecurityCodeEntity {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: number;

  @Column({
    name: 'type',
  })
  type: string;

  @Column({
    name: 'token',
  })
  token: string;

  @Column({
    name: 'expired_at',
    type: 'timestamp',
    nullable: true,
  })
  expiredAt: Date;

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
}
