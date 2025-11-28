import { Entity, ManyToOne, JoinColumn, Unique, Index, Column } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from './user.entity';

@Entity('follows')
@Unique('unique_follow', ['followerId', 'followingId'])
@Index('idx_follower', ['followerId'])
@Index('idx_following', ['followingId'])
export class Follow extends BaseEntity {
  @Column({ name: 'follower_id', type: 'uuid' })
  followerId!: string;

  @Column({ name: 'following_id', type: 'uuid' })
  followingId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'follower_id' })
  follower!: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'following_id' })
  following!: User;

  constructor(followerId?: string, followingId?: string) {
    super();
    if (followerId) this.followerId = followerId;
    if (followingId) this.followingId = followingId;
  }
}
