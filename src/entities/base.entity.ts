import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import newDateUtc from '@/utils/new-date-utc';
import { v7 as uuidv7 } from 'uuid';

export abstract class BaseEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @BeforeInsert()
  setId() {
    if (!this.id) this.id = uuidv7();
  }

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

function PrimaryColumn(arg0: string): (target: BaseEntity, propertyKey: "id") => void {
    throw new Error('Function not implemented.');
}
