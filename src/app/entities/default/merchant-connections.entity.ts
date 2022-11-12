import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('merchant_connections')
export class MerchantConnectionEntity {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({ name: 'merchant_id', type: 'bigint', nullable: true })
  merchantId: number;

  @Column({ name: 'prefix', type: 'varchar' })
  prefix: string;

  @Column({ name: 'connection', type: 'json' })
  connection: string;
}
