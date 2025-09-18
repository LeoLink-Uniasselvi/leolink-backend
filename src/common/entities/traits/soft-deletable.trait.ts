import { DeleteDateColumn } from 'typeorm';
import { Constructor } from '@/common/types/constructor.type';

export function SoftDeletable<TBase extends Constructor>(Base: TBase) {
  abstract class SoftDeletableClass extends Base {
    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deletedAt?: Date | null;
  }
  return SoftDeletableClass;
}
