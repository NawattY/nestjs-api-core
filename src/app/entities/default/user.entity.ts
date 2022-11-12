import { UserType } from '../../common/enums/user-type';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MerchantEntity } from './merchant.entity';
import { AuthAccessTokenEntity } from './auth-access-token.entity';

@Entity('users')
export class UserEntity {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({
    name: 'full_name',
  })
  fullName: string;

  @Column({ name: 'email', nullable: false, unique: true })
  email: string;

  @Column({
    name: 'password',
  })
  password: string;

  @Column({
    name: 'mobile',
  })
  mobile: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: UserType,
  })
  type: UserType;

  @Column({ name: 'profile_image', nullable: true })
  profileImage: string;

  @Column({ name: 'merchant_id', type: 'bigint' })
  merchantId: number;

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

  @OneToOne(() => MerchantEntity, (merchant) => merchant.id)
  @JoinColumn({
    name: 'merchant_id',
    referencedColumnName: 'id',
  })
  merchant: MerchantEntity;

  @OneToMany(
    () => AuthAccessTokenEntity,
    (authAccessToken) => authAccessToken.id,
  )
  @JoinColumn({
    name: 'id',
    referencedColumnName: 'user_id',
  })
  authAccessToken: AuthAccessTokenEntity;
}
