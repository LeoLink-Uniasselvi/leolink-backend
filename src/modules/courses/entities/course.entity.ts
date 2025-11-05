import { Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Named } from '@/common/entities/traits/named.trait';
import { SoftDeletable } from '@/common/entities/traits/soft-deletable.trait';

@Entity('courses')
@Unique('courses_name_unique', ['name'])
export class Course extends SoftDeletable(Named(BaseEntity)) {
  @Column({ type: 'date', name: 'start_date' })
  startDate!: Date;
}

