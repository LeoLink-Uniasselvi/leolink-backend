import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostRepository } from './post.repository';
import type { IPostRepository } from './post.repository';
import { PostAdapter } from './post.adapter';
import { GetPostResponseDto } from './post.dtos';
import { PostNotFoundException } from './posts.exceptions';
import { PostViewRepository } from './post-view.repository';
import { Comment } from '@/modules/comments/entities/comment.entity';
import { PostViewStatsDto } from './post.dtos';

@Injectable()
export class GetPostUseCase {
  constructor(
    @Inject(PostRepository)
    private readonly postRepository: IPostRepository,
    private readonly postAdapter: PostAdapter,
    @Inject(PostViewRepository)
    private readonly postViewRepository: PostViewRepository,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  private async countViews(postId: string): Promise<PostViewStatsDto> {
    const total = await this.postViewRepository.countByPost(postId);
    // unique == total because one view per user enforced
    return {
      totalViews: total,
      uniqueUsers: total,
    };
  }

  async execute(
    postId: string,
    viewerId?: string,
  ): Promise<GetPostResponseDto> {
    const post = await this.postRepository.findById(postId, false);
    if (!post || post.deletedAt) {
      throw new PostNotFoundException();
    }

    if (viewerId) {
      await this.postViewRepository.trackView(postId, viewerId);
    }

    const views = await this.countViews(postId);
    const commentsCount = await this.commentRepository.count({
      where: { postId, deletedAt: null },
    });

    const dto = this.postAdapter.convertToDto(post, {
      viewsCount: views.totalViews,
      commentsCount,
    });

    return {
      data: dto,
      message: 'Post recuperado com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}
