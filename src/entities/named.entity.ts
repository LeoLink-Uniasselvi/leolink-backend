import { Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class NamedEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}