import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Post } from './post.entity';
import { Category } from './category.entity';

/**
 * PostCategory representa a associação entre posts e categorias.
 * A relação é única por par (post, categoria) para evitar duplicidades.
 */
@Entity('post_categories')
@Index('idx_post_categories_post', ['postId'])
@Index('idx_post_categories_category', ['categoryId'])
@Index('uq_post_categories_post_category', ['postId', 'categoryId'], {
  unique: true,
})
export class PostCategory extends BaseEntity {
  @Column({ name: 'post_id', type: 'uuid' })
  postId!: string;

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId!: string;

  @ManyToOne(() => Post, (post) => post.postCategories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post!: Post;

  @ManyToOne(() => Category, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'category_id' })
  category?: Category;

  constructor(init?: Partial<PostCategory>) {
    super();
    Object.assign(this, init);
  }
}
