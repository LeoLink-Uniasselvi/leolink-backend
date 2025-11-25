import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { SoftDeletable } from '@/common/entities/traits/soft-deletable.trait';
import { Post } from '@/modules/posts/entities/post.entity';
import { User } from '@/modules/users/entities/user.entity';

/**
 * Comment entity represents a user generated comment associated with a post.
 * Comments support nesting via the `parentId` property which references
 * another comment in the same post. Soft deletion is provided through
 * the SoftDeletable trait so that threads maintain their structure even
 * when some comments are removed.
 */
@Entity('comments')
@Index('idx_comments_post_id', ['postId'])
@Index('idx_comments_parent_id', ['parentId'])
export class Comment extends SoftDeletable(BaseEntity) {
  /**
   * Identifier of the post to which this comment belongs.
   */
  @Column({ name: 'post_id', type: 'uuid' })
  postId!: string;

  /**
   * Many-to-one relation to the Post entity. When the Posts module is
   * implemented this relation will allow eager loading of posts and
   * enforcement of referential integrity. For now it references a
   * minimal Post stub.
   */
  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post!: Post;

  /**
   * Identifier of the comment author. This field is stored redundantly
   * alongside the relation to User to enable efficient querying by id.
   */
  @Column({ name: 'author_id', type: 'uuid' })
  authorId!: string;

  /**
   * Author of the comment. On user deletion all of their comments
   * should be removed.
   */
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author!: User;

  /**
   * Optional identifier of the parent comment when this comment is a reply.
   */
  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId?: string | null;

  /**
   * Self-referential relation to the parent comment. Cascade deletion
   * ensures that if a parent is permanently removed all replies are
   * removed as well. Soft deletion should be preferred through the
   * repository, but this relation definition ensures referential
   * integrity.
   */
  @ManyToOne(() => Comment, (comment) => comment.replies, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: Comment | null;

  /**
   * Collection of replies to this comment. When retrieving comments
   * hierarchically this property can be used to build a tree of
   * nested discussions.
   */
  @OneToMany(() => Comment, (comment) => comment.parent)
  replies!: Comment[];

  /**
   * Body text of the comment.
   */
  @Column({ type: 'text' })
  content!: string;

  constructor(init?: Partial<Comment>) {
    super();
    Object.assign(this, init);
  }
}