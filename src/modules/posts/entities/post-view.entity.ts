import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Post } from './post.entity';
import { User } from '@/modules/users/entities/user.entity';

/**
 * PostView armazena visualizações de posts para métricas e ordenação
 * por popularidade. Mantém registro do usuário e timestamp da
 * visualização.
 */
@Entity('post_views')
@Index('idx_post_views_post', ['postId'])
@Index('idx_post_views_user', ['userId'])
@Index('uq_post_views_post_user', ['postId', 'userId'], { unique: true })
export class PostView extends BaseEntity {
  @Column({ name: 'post_id', type: 'uuid' })
  postId!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @CreateDateColumn({ name: 'viewed_at', type: 'timestamptz' })
  viewedAt!: Date;

  @ManyToOne(() => Post, (post) => post.views, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post!: Post;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  constructor(init?: Partial<PostView>) {
    super();
    Object.assign(this, init);
  }
}
