import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { AuthAccessTokenEntity } from './auth-access-token.entity';

@Entity('auth_refresh_token')
export class AuthRefreshTokenEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  authAccessTokenId: number;

  @Column({
    name: 'token',
    type: 'varchar',
  })
  token: string;

  @Column({ name: 'expired_at', type: 'timestamp', nullable: true })
  expiredAt: Date;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(0)',
  })
  createdAt: Date;

  @OneToOne(
    () => AuthAccessTokenEntity,
    (authAccessToken) => authAccessToken.id,
  )
  @JoinColumn({
    name: 'auth_access_token_id',
    referencedColumnName: 'id',
  })
  authAccessToken: AuthAccessTokenEntity;
}
