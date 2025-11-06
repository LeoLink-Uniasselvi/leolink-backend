import { Check, Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/users/entities/user.entity';

@Entity('likes')
@Check(
  'CHK_like_target',
  '((post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL))',
)
@Index('IDX_like_post_id', ['postId'])
@Index('IDX_like_comment_id', ['commentId'])
@Index('IDX_like_user_id', ['userId'])
@Index('UQ_like_post_user', ['postId', 'userId'], {
  unique: true,
  where: '"comment_id" IS NULL',
})
@Index('UQ_like_comment_user', ['commentId', 'userId'], {
  unique: true,
  where: '"post_id" IS NULL',
})
export class Like extends BaseEntity {
  @Column({ name: 'post_id', type: 'uuid', nullable: true })
  postId?: string | null;

  @Column({ name: 'comment_id', type: 'uuid', nullable: true })
  commentId?: string | null;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  constructor(init?: Partial<Like>) {
    super();
    Object.assign(this, init);
  }
}
