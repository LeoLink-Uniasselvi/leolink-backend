import { Entity, Unique } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Named } from '@/common/entities/traits/named.trait';

/**
 * Category representa as categorias de posts. Implementação mínima
 * para suportar o relacionamento de PostCategory enquanto o módulo
 * de categorias completo é desenvolvido.
 */
@Entity('categories')
@Unique('uq_categories_name', ['name'])
export class Category extends Named(BaseEntity) {
  constructor(name?: string) {
    super();
    if (name) this.name = name;
  }
}
