import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { SoftDeletable } from '@/common/entities/traits/soft-deletable.trait';
import { Comment } from '@/modules/comments/entities/comment.entity';
import { User } from '@/modules/users/entities/user.entity';
import { PostCategory } from './post-category.entity';
import { PostView } from './post-view.entity';

/**
 * Post representa uma publicação realizada por um usuário. Suporta
 * conteúdos institucionais, imagem opcional e categorias.
 * A exclusão é lógica para permitir recuperação futura.
 */
@Entity('posts')
@Index('idx_posts_author_id', ['authorId'])
@Index('idx_posts_institutional', ['isInstitutional'])
export class Post extends SoftDeletable(BaseEntity) {
  @Column({ name: 'author_id', type: 'uuid' })
  authorId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author!: User;

  @Column({ type: 'text' })
  content!: string;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl?: string | null;

  @Column({ name: 'is_institutional', type: 'boolean', default: false })
  isInstitutional: boolean = false;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];

  @OneToMany(() => PostCategory, (postCategory) => postCategory.post, {
    cascade: true,
  })
  postCategories?: PostCategory[];

  @OneToMany(() => PostView, (postView) => postView.post)
  views?: PostView[];

  constructor(init?: Partial<Post>) {
    super();
    Object.assign(this, init);
  }
}
