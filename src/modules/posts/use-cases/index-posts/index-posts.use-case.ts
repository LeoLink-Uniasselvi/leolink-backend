import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../repositories/post.repository';

interface IndexPostsResult {
  posts: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class IndexPostsUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(page: number = 1, limit: number = 10, search?: string): Promise<IndexPostsResult> {
    console.log('[IndexPostsUseCase] Buscando posts:', { page, limit, search });
    const [posts, total] = await this.postRepository.findAllWithAuthor(page, limit, search);
    console.log('[IndexPostsUseCase] Posts encontrados:', { total, postsLength: posts.length });
    
    return {
      posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
