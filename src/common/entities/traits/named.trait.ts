import { Column } from 'typeorm';
import { Constructor } from '@/common/types/constructor.type';

export function Named<TBase extends Constructor>(Base: TBase) {
  abstract class NamedClass extends Base {
    @Column({ length: 120 })
    name!: string;
  }
  return NamedClass;
}
