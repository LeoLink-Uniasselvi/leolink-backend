import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../repositories/post.repository';
import { Post } from '../../entities/post.entity';
import { PostNotFoundException } from '../../exceptions';

@Injectable()
export class GetPostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(id: string): Promise<Post> {
    const post = await this.postRepository.findByIdWithAuthor(id);
    
    if (!post) {
      throw new PostNotFoundException(id);
    }
    
    return post;
  }
}
