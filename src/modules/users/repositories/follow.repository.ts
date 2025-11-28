import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from '../entities/follow.entity';

export interface IFollowRepository {
  follow(followerId: string, followingId: string): Promise<Follow>;
  unfollow(followerId: string, followingId: string): Promise<void>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  getFollowers(userId: string, page: number, limit: number): Promise<{ items: Follow[]; total: number }>;
  getFollowing(userId: string, page: number, limit: number): Promise<{ items: Follow[]; total: number }>;
  getFollowersCount(userId: string): Promise<number>;
  getFollowingCount(userId: string): Promise<number>;
}

@Injectable()
export class FollowRepository implements IFollowRepository {
  constructor(
    @InjectRepository(Follow)
    private typeormRepository: Repository<Follow>,
  ) {}

  async follow(followerId: string, followingId: string): Promise<Follow> {
    const follow = new Follow(followerId, followingId);
    await this.typeormRepository.save(follow);
    return follow;
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    await this.typeormRepository.delete({
      followerId,
      followingId,
    });
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.typeormRepository.findOne({
      where: {
        followerId,
        followingId,
      },
    });
    return !!follow;
  }

  async getFollowers(userId: string, page: number, limit: number): Promise<{ items: Follow[]; total: number }> {
    const [items, total] = await this.typeormRepository.findAndCount({
      where: {
        followingId: userId,
      },
      relations: ['follower'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });
    return { items, total };
  }

  async getFollowing(userId: string, page: number, limit: number): Promise<{ items: Follow[]; total: number }> {
    const [items, total] = await this.typeormRepository.findAndCount({
      where: {
        followerId: userId,
      },
      relations: ['following'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });
    return { items, total };
  }

  async getFollowersCount(userId: string): Promise<number> {
    return await this.typeormRepository.count({
      where: {
        followingId: userId,
      },
    });
  }

  async getFollowingCount(userId: string): Promise<number> {
    return await this.typeormRepository.count({
      where: {
        followerId: userId,
      },
    });
  }
}
