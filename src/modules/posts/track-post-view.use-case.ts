import { Inject, Injectable } from '@nestjs/common';
import { PostViewRepository } from './post-view.repository';
import { PostRepository } from './post.repository';
import type { IPostRepository } from './post.repository';
import { PostNotFoundException } from './posts.exceptions';

@Injectable()
export class TrackPostViewUseCase {
  constructor(
    @Inject(PostViewRepository)
    private readonly postViewRepository: PostViewRepository,
    @Inject(PostRepository)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(postId: string, userId: string): Promise<void> {
    const post = await this.postRepository.findById(postId);
    if (!post || post.deletedAt) {
      throw new PostNotFoundException();
    }
    await this.postViewRepository.trackView(postId, userId);
  }
}
