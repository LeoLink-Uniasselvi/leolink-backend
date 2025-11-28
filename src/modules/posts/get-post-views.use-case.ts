import { Inject, Injectable } from '@nestjs/common';
import { PostViewRepository } from './post-view.repository';
import { PostRepository } from './post.repository';
import type { IPostRepository } from './post.repository';
import { PostViewsResponseDto } from './post.dtos';
import { PostNotFoundException } from './posts.exceptions';

@Injectable()
export class GetPostViewsUseCase {
  constructor(
    @Inject(PostViewRepository)
    private readonly postViewRepository: PostViewRepository,
    @Inject(PostRepository)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(postId: string): Promise<PostViewsResponseDto> {
    const post = await this.postRepository.findById(postId);
    if (!post || post.deletedAt) {
      throw new PostNotFoundException();
    }

    const totalViews = await this.postViewRepository.countByPost(postId);

    return {
      data: {
        totalViews,
        uniqueUsers: totalViews,
      },
      message: 'Estatisticas de visualizacao recuperadas com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}
