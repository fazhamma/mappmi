import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('country_cert_stats')
@Index(['countryCode', 'certType', 'year'])
@Index(['year'])
@Index(['certType'])
export class CountryCertStat {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'country_code', type: 'varchar', length: 2 })
  countryCode!: string;

  @Column({ name: 'country_name', type: 'varchar', length: 100 })
  countryName!: string;

  @Column({ type: 'integer' })
  year!: number;

  @Column({ name: 'cert_type', type: 'varchar', length: 20 })
  certType!: string;

  @Column({ name: 'active_count', type: 'integer', default: 0 })
  activeCount!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
