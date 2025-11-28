import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../repositories/post.repository';
import { PostNotFoundException, UnauthorizedPostAccessException } from '../../exceptions';

@Injectable()
export class DeletePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const post = await this.postRepository.findById(id);
    
    if (!post) {
      throw new PostNotFoundException(id);
    }

    if (post.authorId !== userId) {
      throw new UnauthorizedPostAccessException();
    }

    await this.postRepository.delete(id);
  }
}
