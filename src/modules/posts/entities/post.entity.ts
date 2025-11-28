import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { SoftDeletable } from '@/common/entities/traits/soft-deletable.trait';
import { User } from '@/modules/users/entities/user.entity';
import { Comment } from '@/modules/comments/entities/comment.entity';

@Entity('posts')
export class Post extends SoftDeletable(BaseEntity) {
  @Column({ type: 'text' })
  content!: string;

  @Column({ name: 'author_id', type: 'uuid' })
  authorId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author!: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];

  constructor(init?: Partial<Post>) {
    super();
    Object.assign(this, init);
  }
}
