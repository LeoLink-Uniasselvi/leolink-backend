import { Entity, ManyToOne, JoinColumn, Index, CreateDateColumn, PrimaryColumn } from 'typeorm';
import { User } from '@/modules/users/entities/user.entity';

@Entity('follows')
@Index(['followerId', 'followeeId'], { unique: true })
export class Follow {
  @PrimaryColumn('uuid', { name: 'follower_id' })
  followerId: string;

  @PrimaryColumn('uuid', { name: 'followee_id' })
  followeeId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'follower_id' })
  follower: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followee_id' })
  followee: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  constructor(followerId: string, followeeId: string) {
    this.followerId = followerId;
    this.followeeId = followeeId;
  }
}