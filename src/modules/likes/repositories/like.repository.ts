import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '@/modules/likes/entities/like.entity';
import { IRepository } from '@/common/repositories/repository';

export interface ILikeRepository extends IRepository<Like> {
  findByUserAndPost(userId: string, postId: string): Promise<Like | null>;
  findByUserAndComment(userId: string, commentId: string): Promise<Like | null>;
  findByPost(postId: string): Promise<Like[]>;
  findByComment(commentId: string): Promise<Like[]>;
  findByUser(userId: string): Promise<Like[]>;
  countByPost(postId: string): Promise<number>;
  countByComment(commentId: string): Promise<number>;
  countByTargetId(targetId: string): Promise<number>;
  hasUserLiked(userId: string, targetId: string): Promise<boolean>;
}

@Injectable()
export class LikeRepository implements ILikeRepository {
  constructor(
    @InjectRepository(Like)
    private readonly typeormRepository: Repository<Like>,
  ) {}

  async create(like: Like): Promise<void> {
    await this.typeormRepository.save(like);
  }

  async update(like: Like): Promise<void> {
    await this.typeormRepository.update(like.id, like);
  }

  async delete(id: string): Promise<void> {
    await this.typeormRepository.delete(id);
  }

  async find(): Promise<Like[]> {
    return await this.typeormRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Like> {
    return await this.typeormRepository.findOne({
      where: { id },
    });
  }

  async findByUserAndPost(
    userId: string,
    postId: string,
  ): Promise<Like | null> {
    return await this.typeormRepository.findOne({
      where: { userId, postId },
    });
  }

  async findByUserAndComment(
    userId: string,
    commentId: string,
  ): Promise<Like | null> {
    return await this.typeormRepository.findOne({
      where: { userId, commentId },
    });
  }

  async findByPost(postId: string): Promise<Like[]> {
    return await this.typeormRepository.find({
      where: { postId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByComment(commentId: string): Promise<Like[]> {
    return await this.typeormRepository.find({
      where: { commentId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<Like[]> {
    return await this.typeormRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async countByPost(postId: string): Promise<number> {
    return await this.typeormRepository.count({
      where: { postId },
    });
  }

  async countByComment(commentId: string): Promise<number> {
    return await this.typeormRepository.count({
      where: { commentId },
    });
  }

  async countByTargetId(targetId: string): Promise<number> {
    // Conta likes que tenham postId OU commentId igual ao targetId
    return await this.typeormRepository
      .createQueryBuilder('like')
      .where('like.postId = :targetId OR like.commentId = :targetId', { targetId })
      .getCount();
  }

  async hasUserLiked(userId: string, targetId: string): Promise<boolean> {
    const count = await this.typeormRepository
      .createQueryBuilder('like')
      .where('like.userId = :userId', { userId })
      .andWhere('(like.postId = :targetId OR like.commentId = :targetId)', { targetId })
      .getCount();
    return count > 0;
  }
}
