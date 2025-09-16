import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import newDateUtc from '@/utils/new-date-utc';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestampz')
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column('timestampz')
  @UpdateDateColumn({ name: 'updated_at', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column('timestampz')
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  constructor() {
    this.createdAt = newDateUtc();
    this.createdAt = newDateUtc();
  }
}