import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../repositories/post.repository';
import { FollowRepository } from '@/modules/users/repositories/follow.repository';

@Injectable()
export class GetFeedUseCase {
  constructor(
    private postRepository: PostRepository,
    private followRepository: FollowRepository,
  ) {}

  async execute(userId: string, page: number = 1, limit: number = 10) {
    // Buscar IDs dos usuários que o usuário atual segue
    const { items: following } = await this.followRepository.getFollowing(userId, 1, 1000);
    const followingIds = following.map(f => f.followingId);
    
    // Incluir o próprio usuário no feed
    followingIds.push(userId);

    const [posts, total] = await this.postRepository.findByAuthorIds(followingIds, page, limit);

    return {
      posts,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
