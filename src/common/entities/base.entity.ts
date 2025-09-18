import {
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

export class BaseEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @BeforeInsert()
  setId() {
    if (!this.id) this.id = uuidv7();
  }

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
