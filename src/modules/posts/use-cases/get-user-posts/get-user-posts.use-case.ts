import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../repositories/post.repository';

@Injectable()
export class GetUserPostsUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(userId: string, page: number = 1, limit: number = 10) {
    const [posts, total] = await this.postRepository.findByAuthorIdPaginated(userId, page, limit);

    return {
      posts,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
