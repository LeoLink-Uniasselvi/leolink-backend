import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Follow } from '@/modules/follows/entities/follow.entity';
import { User } from '@/modules/users/entities/user.entity';

export interface IFollowRepository {
  create(follow: Follow): Promise<void>;
  delete(followerId: string, followeeId: string): Promise<void>;
  findByFollowerAndFollowee(followerId: string, followeeId: string): Promise<Follow | null>;
  findFollowers(userId: string, page: number, limit: number): Promise<{ followers: User[], total: number }>;
  findFollowing(userId: string, page: number, limit: number): Promise<{ following: User[], total: number }>;
  countFollowers(userId: string): Promise<number>;
  countFollowing(userId: string): Promise<number>;
  isFollowing(followerId: string, followeeId: string): Promise<boolean>;
  findMutualFollows(userId1: string, userId2: string): Promise<User[]>;
  findSuggestedUsers(userId: string, limit?: number): Promise<User[]>;
}

@Injectable()
export class FollowRepository implements IFollowRepository {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(follow: Follow): Promise<void> {
    await this.followRepository.save(follow);
  }

  async delete(followerId: string, followeeId: string): Promise<void> {
    await this.followRepository.delete({ followerId, followeeId });
  }

  async findByFollowerAndFollowee(followerId: string, followeeId: string): Promise<Follow | null> {
    return this.followRepository.findOne({
      where: { followerId, followeeId },
      relations: ['follower', 'followee'],
    });
  }

  async findFollowers(userId: string, page: number, limit: number): Promise<{ followers: User[], total: number }> {
    const [follows, total] = await this.followRepository.findAndCount({
      where: { followeeId: userId },
      relations: ['follower'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const followers = follows.map(follow => follow.follower);
    return { followers, total };
  }

  async findFollowing(userId: string, page: number, limit: number): Promise<{ following: User[], total: number }> {
    const [follows, total] = await this.followRepository.findAndCount({
      where: { followerId: userId },
      relations: ['followee'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const following = follows.map(follow => follow.followee);
    return { following, total };
  }

  async countFollowers(userId: string): Promise<number> {
    return this.followRepository.count({
      where: { followeeId: userId },
    });
  }

  async countFollowing(userId: string): Promise<number> {
    return this.followRepository.count({
      where: { followerId: userId },
    });
  }

  async isFollowing(followerId: string, followeeId: string): Promise<boolean> {
    const follow = await this.followRepository.findOne({
      where: { followerId, followeeId },
    });
    return !!follow;
  }

  async findMutualFollows(userId1: string, userId2: string): Promise<User[]> {
    // Encontra usuários que seguem tanto userId1 quanto userId2
    const query = this.userRepository
      .createQueryBuilder('user')
      .innerJoin(Follow, 'f1', 'f1.follower_id = user.id AND f1.followee_id = :userId1', { userId1 })
      .innerJoin(Follow, 'f2', 'f2.follower_id = user.id AND f2.followee_id = :userId2', { userId2 })
      .where('user.id NOT IN (:...userIds)', { userIds: [userId1, userId2] });

    return query.getMany();
  }

  async findSuggestedUsers(userId: string, limit: number = 10): Promise<User[]> {
    // Encontra usuários que não estão sendo seguidos pelo usuário atual
    // Pode ser expandido para incluir lógica baseada em área/curso
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoin(Follow, 'follow', 'follow.followee_id = user.id AND follow.follower_id = :userId', { userId })
      .where('user.id != :userId', { userId })
      .andWhere('follow.id IS NULL')
      .andWhere('user.is_active = :isActive', { isActive: true })
      .limit(limit)
      .orderBy('RANDOM()'); // PostgreSQL random

    return query.getMany();
  }
}