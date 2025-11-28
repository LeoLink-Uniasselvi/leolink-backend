import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostView } from './entities/post-view.entity';

export interface IPostViewRepository {
  trackView(postId: string, userId: string): Promise<void>;
  countByPost(postId: string): Promise<number>;
  countUniqueByPost(postId: string): Promise<number>;
}

@Injectable()
export class PostViewRepository implements IPostViewRepository {
  constructor(
    @InjectRepository(PostView)
    private readonly typeormRepository: Repository<PostView>,
  ) {}

  async trackView(postId: string, userId: string): Promise<void> {
    await this.typeormRepository
      .createQueryBuilder()
      .insert()
      .values({ postId, userId })
      .orIgnore()
      .execute();
  }

  async countByPost(postId: string): Promise<number> {
    return this.typeormRepository.count({ where: { postId } });
  }

  async countUniqueByPost(postId: string): Promise<number> {
    // Unique constraint ensures one view per user, so same as count
    return this.countByPost(postId);
  }
}
