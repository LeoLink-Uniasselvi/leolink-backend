import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../repositories/post.repository';
import { Post } from '../../entities/post.entity';
import { PostNotFoundException, UnauthorizedPostAccessException } from '../../exceptions';

@Injectable()
export class UpdatePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(id: string, content: string, userId: string): Promise<Post> {
    const post = await this.postRepository.findById(id);
    
    if (!post) {
      throw new PostNotFoundException(id);
    }

    if (post.authorId !== userId) {
      throw new UnauthorizedPostAccessException();
    }

    post.content = content;
    await this.postRepository.update(post);
    
    return this.postRepository.findByIdWithAuthor(id) as Promise<Post>;
  }
}
